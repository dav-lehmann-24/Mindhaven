const exp = require('express');
const router = exp.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome back, user ${req.user.email}!`, user: req.user });
});


module.exports = router;
