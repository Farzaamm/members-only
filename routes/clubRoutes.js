const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

router.get('/createClub', clubController.showCreateClubForm);
router.post('/createClub', clubController.createClub);

router.get('/joinClub/:club_id', clubController.showJoinClubForm);

router.post('/joinClub/:club_id', clubController.joinClub);


module.exports = router;