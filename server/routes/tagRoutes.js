const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const tagController = require("../controllers/tagController");


router.get("/trend", verifyToken, tagController.getMoodTrend);
router.get("/", tagController.getTagsByMood);

module.exports = router;