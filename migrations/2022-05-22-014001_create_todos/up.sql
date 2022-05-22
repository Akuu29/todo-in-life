-- Your SQL goes here
CREATE TABLE todos (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content VARCHAR(900),
    category VARCHAR(18) NOT NULL,
    date_limit DATE,
    status BOOLEAN NOT NULL DEFAULT false,
    date_created TIMESTAMP NOT NULL,
    user_id CHAR(36) NOT NULL
);