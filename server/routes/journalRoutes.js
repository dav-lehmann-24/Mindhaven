
// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { createJournal, updateJournal, deleteJournal, getJournalsByUserId } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create', createJournal);
router.put('/update/:id', updateJournal);
router.delete('/delete/:id', deleteJournal);
// router.get('/user/:userId', getJournalsByUserId);

module.exports = router;

