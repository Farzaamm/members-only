const Club = require('../models/clubModel');
const bcrypt = require('bcryptjs');

module.exports = {
    showCreateClubForm: (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a club.');
            return res.redirect('/login');
        }
        res.render('pages/createClub', { title: 'Create a Club' });
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
            await Club.create(clubData); // Call the create method from the Club model
            res.redirect('/clubForum'); // Redirect to the club forum or another page after successful creation
        }
        catch (error) {
            console.error('Error creating club:', error);
            req.flash('error_msg', 'An error occurred while creating the club.');
            return res.redirect('/createClub');
        }
        req.flash('success_msg', 'Club created successfully!');
    },
    showClubs: async (req, res) => {
        try{
            const clubs = await Club.getAll(); // Fetch all clubs from the model
            res.render('pages/joinClub', {title: 'Join a Club', clubs} );
        } catch (error) {
                console.error('Error fetching clubs:', error);
                req.flash('error_msg', 'An error occurred while fetching clubs.');
                res.redirect('/'); // Redirect to the home page or an error page
        }
    }
    
}