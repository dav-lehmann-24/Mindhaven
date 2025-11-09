const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/ping', testController.testRoute);

module.exports = router;
