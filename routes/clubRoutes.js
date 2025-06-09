const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const msgController = require('../controllers/msgController');

router.get('/createClub', clubController.showCreateClubForm);
router.post('/createClub', clubController.createClub);
router.get('/joinClub', clubController.showClubs);


module.exports = router;