
// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { createJournal, updateJournal, deleteJournal } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create', createJournal);
router.put('/update/:id', updateJournal);
router.delete('/delete/:id', deleteJournal);

module.exports = router;

