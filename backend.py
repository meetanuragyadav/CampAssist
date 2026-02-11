import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)


DB = "campus.db"

# -------- INIT DATABASES --------

def init_db():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    

    # Users Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    # Requests Table (UPGRADED)
    cur.execute("""
CREATE TABLE IF NOT EXISTS requests(
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    urgency TEXT NOT NULL,
    notes TEXT,

    price REAL DEFAULT 0,
    tip REAL DEFAULT 0,

    status TEXT DEFAULT 'OPEN',

    requester_email TEXT NOT NULL,
    accepted_by TEXT,

    priority_score REAL DEFAULT 0,

    created_at TEXT,
    accepted_at TEXT,
    delivered_at TEXT

)
""")
    cur.execute("""
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT
)
""")


    con.commit()
    con.close()

init_db()

# -------- AUTH ROUTES --------

@app.route("/api/users", methods=["GET"])
def get_users():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT * FROM users")
    rows = cur.fetchall()
    con.close()

    return jsonify([
        {"id": r[0], "name": r[1], "email": r[2], "password": r[3]} for r in rows
    ])


@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {"message": "All fields are required"}, 400

    con = sqlite3.connect(DB)
    cur = con.cursor()

    try:
        cur.execute("INSERT INTO users(name, email, password) VALUES(?,?,?)", (name, email, password))
        con.commit()
        con.close()
        return {"message": "Account created successfully!"}, 201

    except sqlite3.IntegrityError:
        con.close()
        return {"message": "Account already exists with this email"}, 409


@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"message": "Missing email or password"}, 400

    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    con.close()

    if not user:
        return {"message": "Account does not exist"}, 404

    if user[3] != password:
        return {"message": "Incorrect password"}, 401

    return {"message": "Login successful!", "id": user[0], "name": user[1], "email": user[2]}, 200

# -------- BUYER REQUEST ROUTES --------

@app.route("/api/requests", methods=["POST"])
def place_request():
    data = request.json

    item = data.get("item_name")
    category = data.get("category")
    urgency = data.get("urgency")
    notes = data.get("notes", "")
    email = data.get("requester_email")

    price = float(data.get("price", 0))
    tip = float(data.get("tip", 0))


    if not item or not category or not urgency or not email:
        return {"message": "Missing required fields"}, 400

    created_at = datetime.utcnow().isoformat()

    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
INSERT INTO requests (
    item_name,
    category,
    urgency,
    notes,
    price,
    tip,
    requester_email,
    status,
    created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN', ?)
""", (
    item,
    category,
    urgency,
    notes,
    price,
    tip,
    email,
    created_at
))


    # 🔔 Notification: Order placed
    cur.execute("""
    INSERT INTO notifications (user_email, message, created_at)
    VALUES (?, ?, ?)
""", (
    email,
    "Your order has been placed successfully",
    created_at
))


    con.commit()
    con.close()

    return {"message": "Request placed successfully!"}, 201

@app.route("/api/requests/<string:emid>", methods=["GET"])
def fetch_requests(emid):
    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
        SELECT id, item_name, category, urgency, notes,
       price, tip,
       status, requester_email, accepted_by,
       priority_score, created_at, accepted_at, delivered_at
        FROM requests
        WHERE requester_email = ?
    """, (emid,))

    rows = cur.fetchall()
    con.close()

    return jsonify([
        {
            "id": r[0],
            "item_name": r[1],
            "category": r[2],
            "urgency": r[3],
            "notes": r[4],
            "price": r[5],
            "tip": r[6],
            "status": r[7],
            "requester_email": r[8],
            "accepted_by": r[9],
            "priority_score": r[10],
            "created_at": r[11],
            "accepted_at": r[12],
            "delivered_at": r[13]
        }
        for r in rows
    ])


@app.route("/api/requests/<int:rid>/accept", methods=["PATCH"])
def accept_task(rid):
    runner_email = request.json.get("runner_email")
    accepted_at = datetime.utcnow().isoformat()

    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("SELECT status FROM requests WHERE id=?", (rid,))
    row = cur.fetchone()

    if not row:
        con.close()
        return {"message": "Request not found"}, 404

    if row[0] != "OPEN":
        con.close()
        return {"message": "Request already processed"}, 409

    cur.execute("""
        UPDATE requests
        SET status='ACCEPTED', accepted_by=?, accepted_at=?
        WHERE id=?
    """, (runner_email, accepted_at, rid))

    con.commit()
    con.close()

    return {"message": "Request accepted!"}, 200






@app.route("/api/requests/<int:rid>/complete", methods=["PATCH"])
def mark_delivered(rid):
    delivered_at = datetime.utcnow().isoformat()

    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
    SELECT status, requester_email
    FROM requests
    WHERE id=?
""", (rid,))
    row = cur.fetchone()

    if not row:
        con.close()
        return {"message": "Request not found"}, 404

    if row[0] == "DELIVERED":
        con.close()
        return {"message": "Already delivered"}, 409

    cur.execute("""
        UPDATE requests
        SET status='DELIVERED', delivered_at=?
        WHERE id=?
    """, (delivered_at, rid))
    # 🔔 Notification: Order delivered
    cur.execute("""
    INSERT INTO notifications (user_email, message, created_at)
    VALUES (?, ?, ?)
""", (
    row[1],  # buyer email
    "Your order has been delivered",
    delivered_at
))


    con.commit()
    con.close()

    return {"message": "Marked as delivered!"}, 200

@app.route("/api/requests", methods=["GET"])
def fetch_all_requests():
    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
        SELECT
            id,
            item_name,
            category,
            urgency,
            notes,
            price,
            tip,
            status,
            requester_email,
            accepted_by,
            created_at,
            accepted_at,
            delivered_at
        FROM requests
        WHERE status != 'DELIVERED'
    """)

    rows = cur.fetchall()
    con.close()

    return jsonify([
        {
            "id": r[0],
            "item_name": r[1],
            "category": r[2],
            "urgency": r[3],
            "notes": r[4],
            "price": r[5],
            "tip": r[6],
            "status": r[7],
            "requester_email": r[8],
            "accepted_by": r[9],
            "created_at": r[10],
            "accepted_at": r[11],
            "delivered_at": r[12],
        }
        for r in rows
    ])


@app.route("/api/notifications/<string:email>", methods=["GET"])
def get_notifications(email):
    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
        SELECT id, message, is_read, created_at
        FROM notifications
        WHERE user_email = ?
        ORDER BY created_at DESC
    """, (email,))

    rows = cur.fetchall()
    con.close()

    return jsonify([
        {
            "id": r[0],
            "message": r[1],
            "is_read": bool(r[2]),
            "created_at": r[3]
        }
        for r in rows
    ])

@app.route("/api/requests/<int:rid>/cancel", methods=["PATCH"])
def cancel_request(rid):
    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("SELECT status FROM requests WHERE id=?", (rid,))
    row = cur.fetchone()

    if not row or row[0] != "OPEN":
        con.close()
        return {"message": "Cannot cancel"}, 400

    cur.execute("""
        UPDATE requests
        SET status='CANCELLED'
        WHERE id=?
    """, (rid,))

    con.commit()
    con.close()
    return {"message": "Request cancelled"}, 200


if __name__ == "__main__":
    app.run(debug=True)