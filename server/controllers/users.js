'use strict';

const db = require('../environment-setup/db-connection-setup');
const crypto = require('crypto');

exports.saveUser = (req, res) => {
    if(!req.isAuthenticated()) {
        const sql = 'INSERT INTO user(username, hshd_psw, salt) VALUES (?, ?, ?);';
        const salt = crypto.randomBytes(16);
        crypto.scrypt(req.body.password, salt, 32, (err, hash) => {
            if (err) throw err;
    
            db.run(sql, [req.body.username, hash.toString('hex'), salt.toString('hex')], function (err) {
                if (err)
                    res.status(500).json({message: err.message});
                
                    res.status(200).json();
            })
        });
    } else {
        res.status(400).json({message: 'User already logged.'});
    }
}