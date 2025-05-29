module.exports = msgController = {
    createMessage: (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a message.');
            return res.redirect('/login');
        }
        res.render('pages/create', { title: 'Create a message' });
    }
};