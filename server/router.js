'use strict';

const express = require('express');
const passport = require('./environment-setup/auth-setup');
const middlewares = require('./environment-setup/middlewares');
const { logout, login } = require('./controllers/auth');
const { getAirplane, deleteBooking, getAirplaneSeats, bookAirplaneSeats } = require('./controllers/airplanes');
const { saveUser } = require('./controllers/users');
const router = new express.Router;

/**
 * Routes that do not require authentication
 */
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', middlewares.ensureAuthenticated, logout);
router.post('/register', saveUser);
router.get('/airplanes/:type', getAirplane);
router.post('/airplanes/:airplaneId/seats', middlewares.ensureAuthenticated, bookAirplaneSeats);
router.delete('/airplanes/:airplaneId/seats', middlewares.ensureAuthenticated, deleteBooking);
router.get('/airplanes/:airplaneId/seats', getAirplaneSeats);
router.get('/authentication', middlewares.ensureAuthenticated, (req, res)=>{res.status(200).send()});

// router.post("/airplanes/:airplane_type/seats/", bookSeats)
// router.delete("user/:username/airplanes/:type/seats/:user", deleteBookedSeatsByUser)
router.get('/guess', middlewares.ensureAuthenticated, (req, res) => {
    res.send(String(Math.floor(Math.random()*100)));
})


module.exports = router;