
// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createJournal, updateJournal, deleteJournal, getJournalsByUserId } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create',verifyToken, createJournal);
router.put('/update/:id', verifyToken, updateJournal);
router.delete('/delete/:id',verifyToken, deleteJournal);
// router.get('/user/:userId', getJournalsByUserId);

module.exports = router;

