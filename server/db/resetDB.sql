
PRAGMA foreign_keys = ON;

drop table if EXISTS seat;
drop table if EXISTS airplane;
drop table if EXISTS user;


CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username varchar not null UNIQUE,
    hshd_psw varchar not null,
    salt varchar not null
);

CREATE TABLE IF NOT EXISTS airplane (
    airplane_id integer primary key AUTOINCREMENT,
    airplane_type varchar not null UNIQUE,
    n_rows integer not null,
    n_cols integer not null
);

CREATE TABLE IF NOT EXISTS seat (
    seat_id INTEGER primary key AUTOINCREMENT,
    user_id integer null,
    airplane_id integer not null,
    seat_row integer not null,
    seat_col integer not null,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id),
    FOREIGN KEY (airplane_id)
        REFERENCES airplane (airplane_id),
    UNIQUE (seat_row, seat_col, airplane_id)
);

-- insert users
INSERT INTO user(username, hshd_psw, salt) VALUES ('geracismo', '5ab3412a25b5cf9375500c90d944a8615a702980fe7efa55460dc124d87a7041','2c99d9758db5863f6106d0424780f56f');
INSERT INTO user(username, hshd_psw, salt) VALUES ('carazzomatarola', '54a80164b9050f432a6381d834e4b5b580366de5a97a649d61bf63014ac261b5', '9aa189021ee654462e506211f4b3ce97');

-- insert airplanes 
INSERT INTO airplane(airplane_type, n_rows, n_cols) values ('local', 15, 4);
INSERT INTO airplane(airplane_type, n_rows, n_cols) values ('regional', 20, 5);
INSERT INTO airplane(airplane_type, n_rows, n_cols) values ('international', 25, 6);




