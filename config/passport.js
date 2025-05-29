const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

passport.use(new localStrategy(async (username, password, done) => { 
    try {
        const user = await User.findByUsername(username); // Find user by username
        if (!user) {
            done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password); // Compare password with hashed password in database
        if (!isMatch) {
            done(null, false, { message: 'Incorrect password' });
        }
        done(null, user);  // If everything is fine, return the user
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser((user, done) => { // store user ID in session cookie
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // retrieve user from database using ID stored in session cookie
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;