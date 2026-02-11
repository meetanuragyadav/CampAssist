const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user_email: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);

