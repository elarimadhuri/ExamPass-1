
const router = require("express").Router();
const exam = require("../controllers/examController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, exam.getExams);
router.post("/", protect, adminOnly, exam.createExam);
router.put("/:id/release", protect, adminOnly, exam.releaseExam);

module.exports = router;
