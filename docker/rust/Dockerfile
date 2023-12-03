FROM rust:1.72.1 as builder

RUN rustup component add rustfmt clippy &&\
    cargo install cargo-watch &&\
    cargo install sqlx-cli

ENV CARGO_BUILD_TARGET_DIR=/tmp/target

RUN USER=root cargo new --bin todo-in-life
WORKDIR /todo-in-life
COPY ./Cargo.toml Cargo.toml
COPY ./Cargo.lock Cargo.lock

RUN cargo build --release --color never &&\
    rm src/*.rs
