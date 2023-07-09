'use strict';

const db = require('../environment-setup/db-connection-setup');

const crypto = require('crypto');
const users = require('./users');


exports.authUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE username = ?';

        db.get(sql, username, (err, row) => {
            if (err) reject(err);
            if (!row) resolve(false)

            const user = row;
            if (user) {
                const salt = Buffer.from(row.salt, 'hex');
                crypto.scrypt(password, salt, 32, (err, hash) => {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.hshd_psw, 'hex'), hash))
                        resolve(false);
                    else resolve(user)
                })
            }
        })
    });
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) res.status(500).json({ message: err.message })

        req.session.destroy((err) => {
            if (err) res.status(500).json({ message: err.message })

            res.status(200).json()
        });
    });
}

exports.login = (req, res) => {
    res.status(200).json({user: { username: req.user.username, userId: req.user.user_id }})
}