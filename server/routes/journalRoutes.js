// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createJournal, updateJournal, deleteJournal, getJournalsByUserId, getJournalById } = require('../controllers/journalController');

// POST /api/journal/create
router.post('/create', verifyToken, createJournal);
router.put('/update/:id', verifyToken, updateJournal);
router.delete('/delete/:id', verifyToken, deleteJournal);
router.get('/user', verifyToken, getJournalsByUserId);
// GET /api/journal/:id
router.get('/:id', verifyToken, getJournalById);

module.exports = router;

