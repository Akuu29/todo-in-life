CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content VARCHAR(900),
    category VARCHAR(18) NOT NULL,
    date_limit TIMESTAMP,
    user_id SERIAL REFERENCES users (id) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);