'use strict';

const sqlite3 = require('sqlite3');
const env = require('./env');
const fs = require('fs');

const existenceSQL = 'SELECT name FROM sqlite_master WHERE type=? AND name in (?, ?, ?)';

const db = new sqlite3.Database(env.DB_PATH, (err) => {
    if (err)
        throw err;

    db.all(existenceSQL, ['table', 'airplane', 'seat', 'user'], (err, rows) => {
        console.log('DB check ...');
        if (err) {
            console.error('Error during checking tables.', err.message);
        } else {
            if (rows.length !== 3) {
                resetDB().then((val) => {
                    console.log(val);
                }).catch((err) => { throw err })
            } else {
                db.get('select count(*) as count from airplane;', (err, row)=>{
                    if(row && row.count === 3) {
                        console.log('DB consistent.');
                    } else {
                        console.log('DB reset needed...');
                        console.log('Starting reset...');
                        resetDB().then((val) => {
                            console.log(val);
                        }).catch((err) => { throw err })
                    }
                });
            }
        }
    });
});

const resetDB = () => {
    return new Promise((resolve, reject) => {
        const deleteTablesSQL = fs.readFileSync('./db/resetDB.sql', 'utf-8');
        db.exec(deleteTablesSQL, function (err) {
            if (err) {
                reject('Error executing SQL file.', err.message);
            } else {
                resolve('DB resetted successfully.')
            }
        });
    });
}

module.exports = db;