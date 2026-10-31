
const Payment = require("../models/Payment");
const Exam = require("../models/Exam");

exports.createPayment = async (req, res) => {
    try {
        const exam = await Exam.findById(req.body.examId);

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        const payment = await Payment.create({
            student: req.user._id,
            exam: exam._id,
            amount: exam.feeAmount
        });

        res.status(201).json({
            message: "Payment record created",
            payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.myPayments = async (req, res) => {
    const payments = await Payment.find({
        student: req.user._id
    }).populate("exam");

    res.json(payments);
};

// Admin dashboard
exports.paymentReport = async (req, res) => {
    try {
        const report = {
            paymentPending: await Payment.find({
                paymentStatus: "PENDING"
            }).populate("student exam"),

            confirmationPending: await Payment.find({
                paymentStatus: "PAID",
                confirmationStatus: "PENDING"
            }).populate("student exam"),

            confirmed: await Payment.find({
                paymentStatus: "PAID",
                confirmationStatus: "CONFIRMED"
            }).populate("student exam"),

            failed: await Payment.find({
                paymentStatus: "FAILED"
            }).populate("student exam")
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
