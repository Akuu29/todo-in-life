use sqlx::postgres::PgPool;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("Unexpected Error: [{0}]")]
    Unexpected(String),
    #[error("NotFound, id is {0}")]
    NotFound(i32),
}

#[derive(Debug, Clone)]
pub struct RepositoryForDb {
    pub pool: PgPool,
}

impl RepositoryForDb {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}
