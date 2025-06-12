const Club = require('../models/clubModel');
const bcrypt = require('bcryptjs');

module.exports = {
    showCreateClubForm: async (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a club.');
            return res.redirect('/login');
        }
        try {
            // Fetch all clubs to display in the form
            const clubs = await Club.getAll();
            res.render('pages/createClub', { title: 'Create a Club', clubs });
        } catch (error) {
            console.error('Error fetching clubs:', error);
            req.flash('error_msg', 'An error occurred while fetching clubs.');
            return res.redirect('/createClub');
        }
    },
    createClub: async (req, res) => {
        // Check if the user is logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a club.')
        }
        // Validate the club name
        const clubName = req.body.clubName;
        if (!clubName || clubName.trim() === '') {
            req.flash('error_msg', 'Club name is required.');
            return res.redirect('/createClub');
        }
        try {
            const clubData = {
                userId: req.user.id, 
                clubName: clubName.trim(),
                passcode: bcrypt.hashSync(req.body.passcode, 10)
            };
            await Club.create(clubData); 
            res.redirect('/clubForum'); // Redirect to the club forum or another page after successful creation
        }
        catch (error) {
            console.error('Error creating club:', error);
            req.flash('error_msg', 'An error occurred while creating the club.');
            return res.redirect('/createClub');
        }
        req.flash('success_msg', 'Club created successfully!');
    },
    showJoinClubForm: async (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to join a club.');
            return res.redirect('/login');
        }
        // Get the club ID from the request parameters and fetch the club details
        const clubId = req.params.club_id;
        try {
            // Fetch the club details to display in the form
            const club = await Club.getById(clubId);
            if (!club) {
                req.flash('error_msg', 'Club not found.');
                return res.redirect('/clubForum');
            }
            res.render('pages/joinClub', { title: `Join ${club.name}`, club });
        } catch (error) {
            console.error('Error fetching club details:', error);
            req.flash('error_msg', 'An error occurred while fetching the club details.');
            return res.redirect('/clubForum');
        }
    },
    joinClub: async (req, res) => {
        // Check if the user is logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to join a club.')
        }
        // Get the club ID from the request parameters
        const clubId = req.params.club_id;
        const userId = req.user.id;
        const passcode = req.body.passcode
        
        const club = await Club.getById(clubId)
        if (!club) {
            req.flash('error_msg', 'Club not found.');
            return res.redirect('/clubForum');
        }
        // Validate the passcode
        // console.log('passcode:', passcode, 'club.passcode:', club.passcode);
        const isMatch = await bcrypt.compare(passcode, club.passcode);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect passcode. Please try again.');
            return res.redirect('/joinClub/' + clubId);
        }
        // console.log('passcode match successful');
        try {
            await Club.join(clubId, userId);
            res.redirect('/clubForum'); // Redirect to the club forum or another page after successful joining
        }
        catch (error) {
            console.error('Error joining club:', error);
            req.flash('error_msg', 'An error occurred while joining the club.');
            return res.redirect('/joinClub/' + clubId);
        }
        req.flash('success_msg', 'Joined the club successfully!');
    }
    
}