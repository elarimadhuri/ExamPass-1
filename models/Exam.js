
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    examCode: { type: String, unique: true },
    department: String,
    examDate: Date,
    examTime: String,
    examCenter: String,
    feeAmount: { type: Number, required: true },
    hallTicketReleased: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
