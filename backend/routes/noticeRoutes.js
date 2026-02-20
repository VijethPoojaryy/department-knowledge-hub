const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createNotice, getNotices } = require("../controllers/noticeController");

router.post("/", auth, createNotice);
router.get("/", getNotices);

module.exports = router;