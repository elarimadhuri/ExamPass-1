
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    amount: { type: Number, required: true },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },
    confirmationStatus: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "FAILED"],
        default: "PENDING"
    },
    confirmedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
