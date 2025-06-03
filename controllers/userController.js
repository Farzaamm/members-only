const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const passport = require('passport');


module.exports = userController = {
    showLoginForm: (req, res) => {
        res.render('pages/login', {title: 'Login', message: req.flash('error')}); // Pass the error message from flash
    },
    showSignupForm: (req, res) => {
        res.render('pages/signup', {title: 'Signup', errors: []});// Initialize errors as an empty array
    },
    createUser : async (req, res) => {
        const {first_name, last_name, username, email, password, confirmPassword} = req.body;
        const errors = [];
        if (password !== confirmPassword) {
            errors.push({msg: 'Passwords do not match'});
        }
        if (errors.length > 0) {
            res.render('pages/signup', {title: 'Signup', errors});
        } else {
            const user = await User.findByUsername(username);
            if (user) {
                errors.push({msg: 'User already exists'});
                res.render('pages/signup', {title: 'Signup', errors});
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({first_name, last_name, username, email, password: hashedPassword});
                if (!newUser) {
                    console.error('Error creating user');
                    return res.status(500).send('Error creating user');
                }
                // Automatically log in the user after registration
                passport.authenticate('local', (err, newUser) => {
                    if (err || !newUser) {
                        console.error('Error logging in user:', err);
                        return res.status(500).send('Error logging in user');
                    }
                    req.login(newUser, (err) => {
                    if (err) {
                        console.error('Error logging in user:', err);
                        return res.status(500).send('Error logging in user');
                    }
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/clubForum');
                    });
                })(req, res);
                
            }
        }
        
    },
    userLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
}
