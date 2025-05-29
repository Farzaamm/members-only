const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const passport = require('passport');


module.exports = userController = {
    login: (req, res) => {
        res.render('pages/login', {title: 'Login'});
    },
    signup: (req, res) => {
        res.render('pages/signup', {title: 'Signup'});
    },
    createUser : async (req, res) => {
        const {first_Name, last_Name, username, email, password, confirmPassword} = req.body;
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
                await User.create({first_Name, last_Name, username, email, password: hashedPassword});
                res.redirect('/login');
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
