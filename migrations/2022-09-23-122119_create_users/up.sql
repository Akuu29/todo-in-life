-- Your SQL goes here

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(96) NOT NULL,
    data_created TIMESTAMP NOT NULL DEFAULT now()
);