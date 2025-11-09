// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { createJournal } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create', createJournal);

module.exports = router;
