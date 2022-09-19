-- Your SQL goes here

CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    content VARCHAR(900),
    category VARCHAR(18) NOT NULL,
    date_limit DATE,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    user_id UUID REFERENCES users (id) NOT NULL
);