const exp = require('express');
const router = exp.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/request-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.put('/update-profile', verifyToken, upload.single('profile_picture'), authController.updateProfile);
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome back, user ${req.user.email}!`, user: req.user });
});

module.exports = router;

