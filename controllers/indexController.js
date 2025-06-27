const Message = require('../models/msgModel')

module.exports = indexController = {
    index: async (req, res) => {
        const messages = await Message.getAllMessages();
        res.render('pages/index', { title: 'Home', messages });
    },
    about: (req, res) => {
        res.render('pages/about', { title: 'About' });
    }
}