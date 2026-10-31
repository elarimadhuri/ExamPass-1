
const mongoose = require("mongoose");

const hallTicketSchema = new mongoose.Schema({
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
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    hallTicketNumber: {
        type: String,
        unique: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    lastDownloadedAt: Date,
    released: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

hallTicketSchema.index(
    { student: 1, exam: 1 },
    { unique: true }
);

module.exports = mongoose.model("HallTicket", hallTicketSchema);
