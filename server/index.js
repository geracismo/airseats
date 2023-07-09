'use strict';
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const env = require('./environment-setup/env');
const passport = require('./environment-setup/auth-setup')
const router = require('./router');


const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET', 'DELETE'],
    credentials: true
  }));

// Configure express-session middleware
app.use(
    session({
        secret: env.SECRET,
        cookie: {maxAge: 3600000},
        resave: false,
        saveUninitialized: false,
        name: 'airseats_id'
    })
);

// Initialize passport and restore authentication state, if available
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);

app.listen(env.PORT,
    () => { console.log(`Server started.\nListening on port ${env.PORT}...`) });