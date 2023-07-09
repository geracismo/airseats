'use strict';
const db = require('../environment-setup/db-connection-setup');

exports.deleteBookedSeatsByUser = (userId, airplaneId) => {
    return new Promise((resolve, reject) => {
        const deleteBookedSeatsByUserSQL = 'delete from seat where user_id = ? and airplane_id = ?;';
        db.run(deleteBookedSeatsByUserSQL, [userId, airplaneId], function (err) {
            if (err) reject(err);
            if (this.changes > 0)
                resolve()
            else
                reject({ message: 'No rows affected.' })
        })
    });
};

exports.getSeatsByAirplane = (airplane_id) => {
    return new Promise((resolve, reject) => {
        const seatsSQL = 'select * from seat where airplane_id = ?;'
        db.all(seatsSQL, airplane_id, (err, rows) => {
            if (err) reject(err);
            if (!rows) reject(`Error: no seats for airplane ${airplane_id}`);
            resolve(rows);
        })
    });
};

exports.bookSeats = (seats, userId, airplaneId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');


            db.get('SELECT * FROM seat WHERE user_id = ? and airplane_id = ?;', [userId, airplaneId], (error, row) => {
                if (row || error) {
                    db.run('ROLLBACK', rollbackError => {
                        if (rollbackError) {
                            console.error('Error rolling back:', rollbackError);
                        }
                        reject(row ? { message: "user has already at least 1 other reservation" } : error.message);
                    });
                } else {
                    const checkPromises = seats.map(seat => {
                        return new Promise((resolve, reject) => {
                            const getSQL = `select * from seat where airplane_id = ? and seat_row = ? and seat_col = ?;`
                            db.get(getSQL, [airplaneId, seat.row, seat.col], (err, row) => {
                                if (err) reject(err);
                                if (row) resolve(row);
                                else resolve(null);
                            })
                        });
                    })

                    Promise.all(checkPromises)
                        .then(rows => {
                            const rowsAlreadyReserved = rows.filter(row => row !== null);
                            if (rowsAlreadyReserved.length > 0) {
                                db.run('COMMIT', error => {
                                    if (error) reject(err);
                                    else reject({ rows: { rowsAlreadyReserved } });
                                });
                            } else {

                                const bookPromises = seats.map(seat => {
                                    return new Promise((resolve, reject) => {
                                        const insertSQL = `insert into seat(user_id, airplane_id, seat_row, seat_col) values(?,?,?,?);`;

                                        db.run(insertSQL, [userId, airplaneId, seat.row, seat.col], function (err) {
                                            if (err) reject(err);
                                            else {
                                                db.get('SELECT * FROM seat WHERE seat_id = ?;', [this.lastID], (error, row) => {
                                                    if (error) reject(error);
                                                    else resolve(row);
                                                });
                                            }
                                        });
                                    });
                                });
                                Promise.all(bookPromises)
                                    .then(insertedIDs => {
                                        db.run('COMMIT', error => {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                resolve(insertedIDs);
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        db.run('ROLLBACK', rollbackError => {
                                            if (rollbackError) {
                                                console.error('Error rolling back:', rollbackError);
                                            }
                                            reject(err);
                                        });
                                    });
                            }
                        })
                        .catch((err) => {
                            db.run('ROLLBACK', rollbackError => {
                                if (rollbackError) {
                                    console.error('Error rolling back:', rollbackError);
                                }
                                reject(err);
                            });
                        })
                }
            });
        });
    });
};