const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

router.post('/support', verifyToken, aiController.getMentalHealthSupport);

module.exports = router;
