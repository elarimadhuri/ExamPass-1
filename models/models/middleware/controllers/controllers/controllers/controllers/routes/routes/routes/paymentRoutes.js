
const router = require("express").Router();
const payment = require("../controllers/paymentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create", protect, payment.createPayment);
router.get("/my-payments", protect, payment.myPayments);
router.get("/admin/report", protect, adminOnly, payment.paymentReport);

module.exports = router;
