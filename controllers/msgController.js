const Message = require('../models/msgModel')

module.exports = msgController = {
    showMessages: async (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to view messages.');
            return res.redirect('/login');
        }
        try {
            const messages = await Message.getAllMessages();
            console.log('Fetched messages:', messages);
            res.render('pages/clubForum', { title: 'Forum', messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            req.flash('error_msg', 'An error occurred while fetching messages.');
            res.redirect('/');
        }
    },
    showCreateMessageForm: (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a message.');
            return res.redirect('/login');
        }
        res.render('pages/create', { title: 'Create a message' });
    },
    createMessage: async (req, res) => {
        // Check if user has logged in
        if (!req.user) {
            req.flash('error_msg', 'You must be logged in to create a message.');
            return res.redirect('/login');
        }

        const { content } = req.body;
        if (!content || content.trim() === '') {
            req.flash('error_msg', 'Message content cannot be empty.');
            return res.redirect('/create');
        }

        try {
            const messageData = {
                userId: req.user.id,
                content: content.trim()
            };
            await Message.create(messageData);
            req.flash('success_msg', 'Message created successfully!');
            res.redirect('/clubForum');
        } catch (error) {
            console.error('Error creating message:', error);
            req.flash('error_msg', 'An error occurred while creating the message.');
            res.redirect('/create');
        }
    }
};