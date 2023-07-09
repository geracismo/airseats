'use strict';

const db = require('../environment-setup/db-connection-setup');
const { deleteBookedSeatsByUser, getSeatsByAirplane, bookSeats } = require('../dao/dao-airplane');

exports.getAirplane = (req, res) => {
    const sql = 'select * from airplane where airplane_type = ?;'
    db.get(sql, req.params.type, (err, row) => {
        if (err) res.status(500).json({ message: err.message });
        if (req.isAuthenticated())
            res.status(200).json({ airplane: row });
        else
            res.status(200).json({ airplane: row });
    })
};

exports.bookAirplaneSeats = (req, res) => {
    if (req.body.seats) {
        bookSeats(req.body.seats, req.user.user_id, req.params.airplaneId)
            .then((seats) => { res.status(201).json({ seats: seats }) })
            .catch((err) => {
                if (err && err.rows) res.status(400).json({ rowsAlreadyReserved: err.rows.rowsAlreadyReserved });
                else res.status(400).json({ message: err.message });

            })
    } else {
        res.status(400).json({ message: 'Bad request.' })
    }
};

exports.getAirplaneSeats = (req, res) => {
    getSeatsByAirplane(req.params.airplaneId)
        .then((seats) => { res.status(200).json({ seats: seats }) })
        .catch((err) => { res.status(400).json({ message: err.message }) })
}

exports.deleteBooking = (req, res) => {
    deleteBookedSeatsByUser(req.user.user_id, req.params.airplaneId)
        .then(() => { res.status(200).json({ message: 'Reservation deleted.' }) })
        .catch((err) => { res.status(400).json({ message: err.message }) })
}