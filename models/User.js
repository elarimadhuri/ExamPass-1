
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    rollNumber: { type: String, unique: true, sparse: true },
    department: String,
    year: Number,
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
