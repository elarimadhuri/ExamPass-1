
const Exam = require("../models/Exam");

exports.createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({
            message: "Exam created successfully",
            exam
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.releaseExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            { hallTicketReleased: true },
            { new: true }
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.json({
            message: "Exam released",
            exam
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
