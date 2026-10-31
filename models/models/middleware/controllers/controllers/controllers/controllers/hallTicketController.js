
const HallTicket = require("../models/HallTicket");
const Payment = require("../models/Payment");
const Exam = require("../models/Exam");
const PDFDocument = require("pdfkit");

exports.releaseTickets = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId);

        if (!exam || !exam.hallTicketReleased) {
            return res.status(400).json({
                message: "Release exam first"
            });
        }

        const payments = await Payment.find({
            exam: exam._id,
            paymentStatus: "PAID",
            confirmationStatus: "CONFIRMED"
        });

        let created = 0;

        for (const payment of payments) {
            const existing = await HallTicket.findOne({
                student: payment.student,
                exam: exam._id
            });

            if (!existing) {
                await HallTicket.create({
                    student: payment.student,
                    exam: exam._id,
                    payment: payment._id,
                    hallTicketNumber:
                        "EP-" + require("crypto").randomUUID(),
                    released: true
                });

                created++;
            }
        }

        res.json({
            message: "Hall tickets released",
            totalEligible: payments.length,
            created
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.myTickets = async (req, res) => {
    try {
        const tickets = await HallTicket.find({
            student: req.user._id,
            released: true
        }).populate("exam");

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadTicket = async (req, res) => {
    try {
        const ticket = await HallTicket.findOne({
            _id: req.params.id,
            student: req.user._id,
            released: true
        })
        .populate("student")
        .populate("exam")
        .populate("payment");

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (
            !ticket.exam.hallTicketReleased ||
            ticket.payment.paymentStatus !== "PAID" ||
            ticket.payment.confirmationStatus !== "CONFIRMED"
        ) {
            return res.status(403).json({
                message: "Payment not confirmed"
            });
        }

        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=ExamPass-HallTicket.pdf"
        );

        doc.pipe(res);

        doc.fontSize(24).text("EXAMPASS", { align: "center" });
        doc.moveDown();

        doc.fontSize(18).text("HALL TICKET", { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text("Ticket Number: " + ticket.hallTicketNumber);
        doc.text("Student: " + ticket.student.name);
        doc.text("Roll Number: " + ticket.student.rollNumber);
        doc.text("Exam: " + ticket.exam.examName);
        doc.text("Date: " + ticket.exam.examDate.toDateString());
        doc.text("Time: " + ticket.exam.examTime);
        doc.text("Center: " + ticket.exam.examCenter);

        ticket.downloadCount++;
        ticket.lastDownloadedAt = new Date();

        await ticket.save();

        doc.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.downloadRecords = async (req, res) => {
    try {
        const records = await HallTicket.find()
            .populate("student", "name email rollNumber")
            .populate("exam", "examName");

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
