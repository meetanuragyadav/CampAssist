const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    category: { type: String, required: true },
    urgency: { type: String, required: true },
    notes: { type: String },

    price: { type: Number, default: 0 },
    tip: { type: Number, default: 0 },

    status: {
        type: String,
        default: "OPEN"
    },

    requester_email: { type: String, required: true },
    accepted_by: { type: String },

    priority_score: { type: Number, default: 0 },

    accepted_at: Date,
    delivered_at: Date
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);
