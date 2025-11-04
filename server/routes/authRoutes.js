const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.get('/asd', (req,res)=>{
    res.send('Hello from our server2')
})
module.exports = router;
