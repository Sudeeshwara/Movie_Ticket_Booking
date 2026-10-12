-- =====================================================================
--  Movie Ticket Booking System - Database Script
--  CMJD 114/115 Coursework - IJSE
--
--  Creates the movie_ticket_db database, all tables, and dummy data.
--  Database: MySQL 8
--
--  Login accounts (all passwords are stored as BCrypt hashes):
--    ADMIN     admin@cinema.lk      / admin123
--    CUSTOMER  kasun@gmail.com      / customer123
--    CUSTOMER  nimali@gmail.com     / customer123
--    CUSTOMER  tharindu@gmail.com   / customer123
--    CUSTOMER  ayesha@gmail.com     / customer123
--    CUSTOMER  dilan@gmail.com      / customer123
--
--  WARNING: this script drops and recreates movie_ticket_db.
-- =====================================================================

DROP DATABASE IF EXISTS movie_ticket_db;
CREATE DATABASE movie_ticket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE movie_ticket_db;

-- ---------------------------------------------------------------------
--  Tables
-- ---------------------------------------------------------------------

CREATE TABLE users (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    created_at  DATETIME(6)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20)  NULL,
    role        ENUM('ADMIN','CUSTOMER') NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE movies (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    description  VARCHAR(2000) NULL,
    duration     INT           NOT NULL,
    genre        VARCHAR(50)   NOT NULL,
    language     VARCHAR(50)   NOT NULL,
    release_date DATE          NULL,
    status       ENUM('ENDED','NOW_SHOWING','UPCOMING') NOT NULL,
    title        VARCHAR(150)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE theatres (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    capacity  INT          NOT NULL,
    location  VARCHAR(200) NOT NULL,
    name      VARCHAR(100) NOT NULL,
    status    ENUM('ACTIVE','INACTIVE') NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE shows (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    show_date     DATE          NOT NULL,
    show_time     TIME(6)       NOT NULL,
    status        ENUM('CANCELLED','COMPLETED','SCHEDULED') NOT NULL,
    ticket_price  DECIMAL(10,2) NOT NULL,
    movie_id      BIGINT        NOT NULL,
    theatre_id    BIGINT        NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_shows_movie   FOREIGN KEY (movie_id)   REFERENCES movies (id),
    CONSTRAINT fk_shows_theatre FOREIGN KEY (theatre_id) REFERENCES theatres (id)
) ENGINE = InnoDB;

CREATE TABLE bookings (
    id                 BIGINT        NOT NULL AUTO_INCREMENT,
    booking_date       DATETIME(6)   NOT NULL,
    number_of_tickets  INT           NOT NULL,
    status             ENUM('CANCELLED','CONFIRMED','PENDING') NOT NULL,
    total_amount       DECIMAL(10,2) NOT NULL,
    show_id            BIGINT        NOT NULL,
    user_id            BIGINT        NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_bookings_show FOREIGN KEY (show_id) REFERENCES shows (id),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE booking_seats (
    booking_id   BIGINT      NOT NULL,
    seat_number  VARCHAR(10) NOT NULL,
    CONSTRAINT fk_booking_seats_booking FOREIGN KEY (booking_id) REFERENCES bookings (id)
) ENGINE = InnoDB;

CREATE TABLE payments (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    amount          DECIMAL(10,2) NOT NULL,
    payment_date    DATETIME(6)   NULL,
    payment_method  ENUM('CARD','CASH','ONLINE_TRANSFER') NOT NULL,
    status          ENUM('COMPLETED','FAILED','PENDING','REFUNDED') NOT NULL,
    booking_id      BIGINT        NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_payments_booking UNIQUE (booking_id),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  Users  (admin123 / customer123, BCrypt strength 10)
-- ---------------------------------------------------------------------

INSERT INTO users (id, created_at, email, name, password, phone, role) VALUES
(1, '2026-09-01 08:00:00', 'admin@cinema.lk',    'System Admin',      '$2a$10$zlZM41JrRv3Sk.htu38hQuqVw6S1IOaLIEzXruN9NzkpLRdZwmfgS', '0112345678', 'ADMIN'),
(2, '2026-09-05 10:12:00', 'kasun@gmail.com',    'Kasun Perera',      '$2a$10$94mjhne49WPlJI9gr01K.OM6BH5JnM5LAhb3DlqrTkeOMNrIbWmzi', '0771234567', 'CUSTOMER'),
(3, '2026-09-07 14:30:00', 'nimali@gmail.com',   'Nimali Fernando',   '$2a$10$94mjhne49WPlJI9gr01K.OM6BH5JnM5LAhb3DlqrTkeOMNrIbWmzi', '0712345678', 'CUSTOMER'),
(4, '2026-09-12 09:45:00', 'tharindu@gmail.com', 'Tharindu Silva',    '$2a$10$94mjhne49WPlJI9gr01K.OM6BH5JnM5LAhb3DlqrTkeOMNrIbWmzi', '0761234567', 'CUSTOMER'),
(5, '2026-09-20 17:05:00', 'ayesha@gmail.com',   'Ayesha Rahman',     '$2a$10$94mjhne49WPlJI9gr01K.OM6BH5JnM5LAhb3DlqrTkeOMNrIbWmzi', '0751234567', 'CUSTOMER'),
(6, '2026-10-01 11:20:00', 'dilan@gmail.com',    'Dilan Jayasuriya',  '$2a$10$94mjhne49WPlJI9gr01K.OM6BH5JnM5LAhb3DlqrTkeOMNrIbWmzi', NULL,         'CUSTOMER');

-- ---------------------------------------------------------------------
--  Movies
-- ---------------------------------------------------------------------

INSERT INTO movies (id, title, description, duration, genre, language, release_date, status) VALUES
(1, 'Monsoon Signal',
    'A radio operator on the southern coast picks up a distress call that should not exist, and has one stormy night to find out who sent it.',
    128, 'Thriller', 'English', '2026-09-18', 'NOW_SHOWING'),
(2, 'The Last Lighthouse',
    'An ageing lighthouse keeper and his estranged daughter spend a final season together before the light is automated.',
    116, 'Drama', 'English', '2026-09-25', 'NOW_SHOWING'),
(3, 'Galle Fort Mysteries',
    'A young detective returns to her hometown inside the old fort walls to solve a disappearance that has haunted her family for twenty years.',
    134, 'Mystery', 'Sinhala', '2026-10-02', 'NOW_SHOWING'),
(4, 'Orbit of Echoes',
    'The crew of a deep-space station start receiving messages from themselves, sent from a future they are trying to avoid.',
    142, 'Sci-Fi', 'English', '2026-10-09', 'NOW_SHOWING'),
(5, 'Kandy Express',
    'Three strangers share a train compartment from Colombo to Kandy, and every stop makes their mix-up a little bigger.',
    110, 'Comedy', 'Tamil', '2026-09-30', 'NOW_SHOWING'),
(6, 'Starlit Harbour',
    'Two musicians meet at a harbour-side festival and agree to write one song together before the summer ends.',
    121, 'Romance', 'Sinhala', '2026-11-14', 'UPCOMING'),
(7, 'Iron Peak',
    'A retired mountain rescue leader is pulled back for one last climb when a research team goes missing near the summit.',
    138, 'Action', 'English', '2026-12-05', 'UPCOMING'),
(8, 'Paper Kites',
    'An animated adventure about a group of children whose kites carry them over the hills to a village in the clouds.',
    95, 'Animation', 'English', '2026-07-10', 'ENDED');

-- ---------------------------------------------------------------------
--  Theatres  (capacity = rows x 10 seats, seats labelled A1, A2 ...)
-- ---------------------------------------------------------------------

INSERT INTO theatres (id, name, location, capacity, status) VALUES
(1, 'Reel Seat City Centre',   'Colombo City Centre, Colombo 02',  150, 'ACTIVE'),
(2, 'Reel Seat Galle Face',    'Galle Face, Colombo 03',           120, 'ACTIVE'),
(3, 'Reel Seat Kollupitiya',   'Galle Road, Kollupitiya',          100, 'ACTIVE'),
(4, 'Reel Seat Wellawatte',    'Galle Road, Wellawatte',            80, 'ACTIVE'),
(5, 'Reel Seat Kandy',         'Dalada Veediya, Kandy',             90, 'INACTIVE');

-- ---------------------------------------------------------------------
--  Shows
-- ---------------------------------------------------------------------

INSERT INTO shows (id, movie_id, theatre_id, show_date, show_time, ticket_price, status) VALUES
-- upcoming, bookable
( 1, 1, 1, '2026-10-14', '10:30:00', 1500.00, 'SCHEDULED'),
( 2, 1, 1, '2026-10-14', '18:30:00', 1800.00, 'SCHEDULED'),
( 3, 2, 2, '2026-10-15', '15:00:00', 1600.00, 'SCHEDULED'),
( 4, 3, 3, '2026-10-15', '19:00:00', 1200.00, 'SCHEDULED'),
( 5, 4, 1, '2026-10-16', '20:30:00', 2000.00, 'SCHEDULED'),
( 6, 4, 2, '2026-10-17', '14:00:00', 1900.00, 'SCHEDULED'),
( 7, 5, 4, '2026-10-18', '16:00:00', 1000.00, 'SCHEDULED'),
( 8, 3, 4, '2026-10-20', '18:00:00', 1200.00, 'SCHEDULED'),
( 13, 2, 3, '2026-10-22', '17:30:00', 1500.00, 'SCHEDULED'),
( 14, 5, 2, '2026-10-24', '11:00:00', 1100.00, 'SCHEDULED'),
-- cancelled (cannot be booked)
( 9, 2, 3, '2026-10-19', '21:00:00', 1500.00, 'CANCELLED'),
-- completed (past)
(10, 1, 2, '2026-10-05', '18:30:00', 1700.00, 'COMPLETED'),
(11, 8, 1, '2026-08-20', '11:00:00', 1200.00, 'COMPLETED'),
(12, 5, 5, '2026-10-03', '17:00:00',  900.00, 'COMPLETED');

-- ---------------------------------------------------------------------
--  Bookings  (total_amount = ticket_price x number_of_tickets)
-- ---------------------------------------------------------------------

INSERT INTO bookings (id, user_id, show_id, number_of_tickets, total_amount, booking_date, status) VALUES
( 1, 2,  1, 3, 4500.00, '2026-10-10 09:15:00', 'CONFIRMED'),
( 2, 3,  1, 2, 3000.00, '2026-10-11 14:20:00', 'CONFIRMED'),
( 3, 4,  2, 4, 7200.00, '2026-10-11 18:05:00', 'CONFIRMED'),
( 4, 2,  5, 2, 4000.00, '2026-10-12 10:40:00', 'PENDING'),
( 5, 5,  3, 2, 3200.00, '2026-10-12 11:10:00', 'PENDING'),
( 6, 3,  4, 2, 2400.00, '2026-10-09 12:00:00', 'CANCELLED'),
( 7, 6,  7, 5, 5000.00, '2026-10-12 08:30:00', 'CONFIRMED'),
( 8, 2, 10, 2, 3400.00, '2026-10-04 19:00:00', 'CONFIRMED'),
( 9, 4, 11, 3, 3600.00, '2026-08-18 13:30:00', 'CONFIRMED'),
(10, 5,  9, 2, 3000.00, '2026-10-08 16:45:00', 'CANCELLED'),
(11, 6,  6, 3, 5700.00, '2026-10-12 12:15:00', 'CONFIRMED'),
(12, 3, 12, 2, 1800.00, '2026-10-02 10:00:00', 'CONFIRMED');

INSERT INTO booking_seats (booking_id, seat_number) VALUES
( 1, 'A1'), ( 1, 'A2'), ( 1, 'A3'),
( 2, 'C5'), ( 2, 'C6'),
( 3, 'E3'), ( 3, 'E4'), ( 3, 'E5'), ( 3, 'E6'),
( 4, 'D7'), ( 4, 'D8'),
( 5, 'B4'), ( 5, 'B5'),
( 6, 'F1'), ( 6, 'F2'),
( 7, 'A1'), ( 7, 'A2'), ( 7, 'A3'), ( 7, 'A4'), ( 7, 'A5'),
( 8, 'G4'), ( 8, 'G5'),
( 9, 'C1'), ( 9, 'C2'), ( 9, 'C3'),
(10, 'H1'), (10, 'H2'),
(11, 'B1'), (11, 'B2'), (11, 'B3'),
(12, 'D1'), (12, 'D2');

-- ---------------------------------------------------------------------
--  Payments
--    COMPLETED -> booking CONFIRMED
--    FAILED    -> booking stays PENDING (customer can retry)
--    PENDING   -> payment started, not processed yet
--    REFUNDED  -> paid booking that was cancelled
-- ---------------------------------------------------------------------

INSERT INTO payments (id, booking_id, amount, payment_date, payment_method, status) VALUES
( 1,  1, 4500.00, '2026-10-10 09:17:00', 'CARD',            'COMPLETED'),
( 2,  2, 3000.00, '2026-10-11 14:24:00', 'ONLINE_TRANSFER', 'COMPLETED'),
( 3,  3, 7200.00, '2026-10-11 18:07:00', 'CARD',            'COMPLETED'),
( 4,  4, 4000.00, '2026-10-12 10:42:00', 'CARD',            'FAILED'),
( 5,  5, 3200.00, NULL,                  'CASH',            'PENDING'),
( 6,  6, 2400.00, '2026-10-09 12:02:00', 'CARD',            'REFUNDED'),
( 7,  7, 5000.00, '2026-10-12 08:32:00', 'CASH',            'COMPLETED'),
( 8,  8, 3400.00, '2026-10-04 19:03:00', 'CARD',            'COMPLETED'),
( 9,  9, 3600.00, '2026-08-18 13:31:00', 'CARD',            'COMPLETED'),
(10, 11, 5700.00, '2026-10-12 12:18:00', 'ONLINE_TRANSFER', 'COMPLETED'),
(11, 12, 1800.00, '2026-10-02 10:05:00', 'CASH',            'COMPLETED');

-- ---------------------------------------------------------------------
--  Quick check
-- ---------------------------------------------------------------------

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'movies',        COUNT(*) FROM movies
UNION ALL SELECT 'theatres',      COUNT(*) FROM theatres
UNION ALL SELECT 'shows',         COUNT(*) FROM shows
UNION ALL SELECT 'bookings',      COUNT(*) FROM bookings
UNION ALL SELECT 'booking_seats', COUNT(*) FROM booking_seats
UNION ALL SELECT 'payments',      COUNT(*) FROM payments;
