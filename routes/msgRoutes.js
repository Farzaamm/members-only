const express = require('express');
const router = express.Router();
const msgController = require('../controllers/msgController');


router.get('/create', msgController.showCreateMessageForm);
router.post('/create', msgController.createMessage);
router.get('/clubForum', msgController.showMessages);



module.exports = router;