const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

passport.use(new localStrategy(async (username, password, done) => { // the username and password are passed from the login form (they should match the field names in the login form)
    try {
        const user = await User.findByUsername(username); // Find user by username
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password); // Compare password with hashed password in database
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);  // If everything is fine, return the user
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => { // store user ID in session cookie
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // retrieve user from database using ID stored in session cookie
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

module.exports = passport;