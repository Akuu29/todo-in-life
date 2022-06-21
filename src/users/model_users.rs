use uuid::Uuid;
use chrono::{NaiveDateTime, Utc};
use argon2::Argon2;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHasher, SaltString};
use crate::schema::users;

#[derive(Debug, Clone, Queryable, Insertable)]
#[table_name="users"]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub password: String,
    pub date_created: NaiveDateTime,
}

impl User {
    pub fn new(username: String, email: String, password: String) -> User {
        User {
            id: Uuid::new_v4().to_string(),
            username,
            email,
            password: User::hash_password(password),
            date_created: Utc::now().naive_utc(),
        }
    }
    fn hash_password(password: String) -> String {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();

        argon2.hash_password(password.as_bytes(), &salt)
            .unwrap()
            .to_string()
    }
}