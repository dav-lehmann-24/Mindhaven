const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');


router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/profile/journals', verifyToken, userController.getUserJournals);
router.delete('/delete', verifyToken, userController.deleteAccount);


// Upload & update profile picture
router.post(
  '/profile/upload',
  verifyToken,
  upload.single('profile_picture'),
  userController.uploadProfilePicture
);

module.exports = router;
