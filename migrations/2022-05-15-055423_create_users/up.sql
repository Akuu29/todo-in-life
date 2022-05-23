-- Your SQL goes here

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(96) NOT NULL,
    date_created TIMESTAMP NOT NULL
)