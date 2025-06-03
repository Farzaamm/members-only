const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../middlewares/validator');

// Create
router.get('/signup', userController.showSignupForm);
router.post('/signup', 
    validator.validateSignup, 
    validator.handleValidationErrors,
    userController.createUser);

// Read
router.get('/login', userController.showLoginForm);
router.post('/login', validator.validateLogin, userController.userLogin);

router.get('/logout', userController.logout);

// Update

// Delete

module.exports = router;