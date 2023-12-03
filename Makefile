dev:
	sqlx db create
	sqlx migrate run
	RUST_LOG=debug cargo watch -x run