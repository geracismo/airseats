'use strict';

const auth = require('../controllers/auth');
const db = require('./db-connection-setup')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    new LocalStrategy((username, password, done) => {
        auth.authUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Username or password incorrect'})

            return done(null, user);
        })
    })
);

// Serialize and deserialize user instances for session management
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});

module.exports = passport;
