-- Your SQL goes here

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(96) NOT NULL,
    data_created TIMESTAMP NOT NULL
)