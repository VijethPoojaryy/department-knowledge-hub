const router = require("express").Router();
const { getAll, create, remove } = require("../controllers/resourceController");
const auth = require("../middleware/authMiddleware");

// Protect all resource routes
router.use(auth());   // call auth() because middleware expects roles array

// Get all resources (any logged-in user)
router.get("/", getAll);

// Create resource (any logged-in user)
router.post("/", create);

// Delete resource (only admin or faculty)
router.delete("/:id", auth(["admin", "faculty"]), remove);

module.exports = router;