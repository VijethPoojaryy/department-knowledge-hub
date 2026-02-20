const router = require("express").Router();
const { getAll, create, remove } = require("../controllers/resourceController");
const auth = require("../middleware/authMiddleware");

router.use(auth);
router.get("/", getAll);
router.post("/", create);
router.delete("/:id", remove);

module.exports = router;