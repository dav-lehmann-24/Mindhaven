
// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { createJournal, updateJournal } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create', createJournal);
router.put('/update/:id', updateJournal);

module.exports = router;

