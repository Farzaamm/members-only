const express = require('express');
const router = express.Router();
const msgController = require('../controllers/msgController');


router.get('/create', msgController.createMessage);


module.exports = router;