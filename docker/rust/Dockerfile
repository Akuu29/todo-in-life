FROM rust:1.67 as builder

RUN rustup component add rustfmt clippy rust-analysis &&\
    cargo install cargo-watch &&\
    cargo install iesel_cli --no-default--features --features postgres

WORKDIR /todo-in-life