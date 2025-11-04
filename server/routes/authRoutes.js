const exp = require('express');
const router = exp.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
