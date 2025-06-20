const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const app = express();
const passport = require('./config/passport');
const flash = require('connect-flash');

const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const msgRoutes = require('./routes/msgRoutes');
const clubRoutes = require('./routes/clubRoutes');


// setup view engine
app.set('view engine', 'ejs');

// setup static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// setup session
app.use(session({
    store: new pgSession({ // use PostgreSQL for session storage
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
    }), 
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// setup flash messages
app.use(flash());

// setup global variables for flash messages and user
app.use((req, res, next) => {
    res.locals.user = req.user; // make user available in views
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routes
app.use('/', indexRoutes);
app.use('/', userRoutes);
app.use('/', msgRoutes);
app.use('/', clubRoutes);


// 404
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});

app.listen(3000, () => {
    console.log(`Server started on ${process.env.PORT}`);
});