const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const {
  uploadResource,
  getResources,
  reviewResource,
  getPending
} = require("../controllers/resourceController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post("/upload", auth(["student", "faculty", "admin"]), upload.single("file"), uploadResource);
router.get("/", getResources);
router.get("/pending", auth(["admin", "faculty"]), getPending);
router.put("/review/:id", auth(["admin", "faculty"]), reviewResource);

module.exports = router;