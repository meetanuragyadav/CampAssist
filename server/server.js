const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const Request = require("./models/Request");
const Notification = require("./models/Notification");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// ----------------- DB CONNECTION -----------------
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ----------------- AUTH ROUTES -----------------

// GET all users
app.get("/api/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// REGISTER
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields required" });

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        res.status(409).json({ message: "Account already exists" });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    if (user.password !== password)
        return res.status(401).json({ message: "Incorrect password" });

    res.json({
        message: "Login successful!",
        id: user._id,
        name: user.name,
        email: user.email
    });
});

// ----------------- REQUEST ROUTES -----------------

// PLACE REQUEST
app.post("/api/requests", async (req, res) => {
    const {
        item_name,
        category,
        urgency,
        notes,
        requester_email,
        price,
        tip
    } = req.body;

    if (!item_name || !category || !urgency || !requester_email)
        return res.status(400).json({ message: "Missing fields" });

    const request = new Request({
        item_name,
        category,
        urgency,
        notes,
        requester_email,
        price,
        tip
    });

    await request.save();

    await Notification.create({
        user_email: requester_email,
        message: "Your order has been placed successfully"
    });

    res.status(201).json({ message: "Request placed successfully!" });
});

// GET USER REQUESTS
app.get("/api/requests/:email", async (req, res) => {
    const requests = await Request.find({
        requester_email: req.params.email
    });
    res.json(requests);
});

// ACCEPT REQUEST
app.patch("/api/requests/:id/accept", async (req, res) => {
    const { runner_email } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (request.status !== "OPEN")
        return res.status(409).json({ message: "Already processed" });

    request.status = "ACCEPTED";
    request.accepted_by = runner_email;
    request.accepted_at = new Date();

    await request.save();

    res.json({ message: "Request accepted!" });
});

// COMPLETE REQUEST
app.patch("/api/requests/:id/complete", async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (request.status === "DELIVERED")
        return res.status(409).json({ message: "Already delivered" });

    request.status = "DELIVERED";
    request.delivered_at = new Date();

    await request.save();

    await Notification.create({
        user_email: request.requester_email,
        message: "Your order has been delivered"
    });

    res.json({ message: "Marked as delivered!" });
});

// CANCEL REQUEST
app.patch("/api/requests/:id/cancel", async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request || request.status !== "OPEN")
        return res.status(400).json({ message: "Cannot cancel" });

    request.status = "CANCELLED";
    await request.save();

    res.json({ message: "Request cancelled" });
});

// GET ALL ACTIVE REQUESTS
app.get("/api/requests", async (req, res) => {
    const requests = await Request.find({
        status: { $ne: "DELIVERED" }
    });
    res.json(requests);
});

// ----------------- NOTIFICATIONS -----------------

app.get("/api/notifications/:email", async (req, res) => {
    const notifications = await Notification.find({
        user_email: req.params.email
    }).sort({ createdAt: -1 });

    res.json(notifications);
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
