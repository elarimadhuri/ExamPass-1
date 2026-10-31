
const router = require("express").Router();
const ticket = require("../controllers/hallTicketController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/my-tickets", protect, ticket.myTickets);
router.get("/download/:id", protect, ticket.downloadTicket);

router.post(
    "/release/:examId",
    protect,
    adminOnly,
    ticket.releaseTickets
);

router.get(
    "/admin/download-records",
    protect,
    adminOnly,
    ticket.downloadRecords
);

module.exports = router;
