const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const buddyController = require('../controllers/buddyController');

router.post('/', verifyToken, buddyController.connectBuddy);
router.get('/', verifyToken, buddyController.listBuddies);
router.get('/pending', verifyToken, buddyController.listPendingRequests);

router.get('/tasks/:id', verifyToken, buddyController.getBuddyTasks);
router.post('/tasks/:id', verifyToken, buddyController.addBuddyTask);
router.patch('/tasks/:id/:taskId', verifyToken, buddyController.toggleBuddyTask);

router.put('/streak', verifyToken, buddyController.updateStreak);

router.put('/:id/accept', verifyToken, buddyController.acceptBuddyRequest);
router.delete('/:id/reject', verifyToken, buddyController.rejectBuddyRequest);

router.get('/:id', verifyToken, buddyController.getBuddyProfile);
router.delete('/:id', verifyToken, buddyController.removeBuddy);

module.exports = router;
