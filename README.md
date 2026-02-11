# CampusAssist – Marketplace Assistance Platform

CampusAssist is a task-based assistance system that connects **Buyers** (who post product requests) with **Runners** (who accept tasks and deliver products for a tip).

---

## 🚀 Features

### 🔐 Authentication
- **Signup system** with validation checks:
  - Prevents duplicate accounts using email
  - Enforces password strength and confirm-password match
  - User data stored persistently in a local **SQLite database**
  - Login session persists locally using `localStorage`
- **Login system** with validation checks:
  - Verifies email and password match
  - Stores active session details (`userName`, `userEmail`) locally
  - Redirects user after successful login

### 🛍 Buyer Mode
- Buyers can **post a request for a product** including:
  - `item_name`
  - `price`
  - `tip` (reward for the Runner)
  - `requester_email`
- Requests are stored persistently using SQLite
- Buyer dashboard displays all placed requests in **newest-first order**

### 🏃 Runner Mode
- Runners can:
  - View all **OPEN (available) requests**
  - **Accept a task**
  - **Deliver the requested product**
  - Mark request as **COMPLETED**
- Delivery validation prevents duplicate completion of tasks

---

## 🧠 Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Flask (Python)
- **Database:** SQLite (Persistent local storage)
- **CORS Support:** Enabled for API communication

---

## ⚠ Current Limitations (To Improve Later)
- Passwords are stored in plain text (add hashing in future)
- No JWT or server-side sessions yet
- Only local testing supported (not deployed online)

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST`  | `/api/register` | Create new user account : |
| `POST`  | `/api/login` | Authenticate user login |
| `GET`   | `/api/users` | Fetch all users |
| `POST`  | `/api/requests` | Buyer posts a new request |
| `GET`   | `/api/requests/:id` | Fetch all requests |
| `PATCH` | `/api/requests/:id/accept` | Runner accepts a task |
| `PATCH` | `/api/requests/:id/complete` | Buyer marks delivered |

---

## ▶ Setup & Run Locally

### 1️⃣ Install Frontend Dependencies
```bash
npm install
```

### 2️⃣ Start Backend (Flask API)
```bash
    pip install -r requirements.txt
```
```bash
python backend.py
```

### 3️⃣ Start Frontend (React + Vite)
```bash
npm run dev
```
