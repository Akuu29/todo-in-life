use crate::repository::RepositoryForDb;
use actix_web::web::Form;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHasher, SaltString};
use argon2::Argon2;
use async_trait::async_trait;
use serde::Deserialize;
use sqlx::FromRow;
use validator::Validate;

#[derive(Debug, Clone, FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct SignupUser {
    #[validate(length(
        min = 4,
        max = 32,
        message = "Username must be between 4 and 32 characters"
    ))]
    pub username: String,
    #[validate(email(message = "Email address entered is invalid"))]
    pub email: String,
    #[validate(length(
        min = 8,
        max = 32,
        message = "Password must be between 8 and 32 characters"
    ))]
    pub password: String,
}

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct LoginUser {
    #[validate(length(
        min = 4,
        max = 32,
        message = "Username must be between 4 and 32 characters"
    ))]
    pub username: String,
    #[validate(length(
        min = 8,
        max = 32,
        message = "Password must be between 8 and 32 characters"
    ))]
    pub password: String,
}

impl NewUser {
    pub fn new(form_data: Form<SignupUser>) -> Self {
        NewUser {
            username: form_data.username.clone(),
            email: form_data.email.clone(),
            password: NewUser::convert_hash_password(form_data.password.clone()),
        }
    }
    // パスワードを文字列からハッシュに変換
    fn convert_hash_password(password: String) -> String {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();

        argon2
            .hash_password(password.as_bytes(), &salt)
            .unwrap()
            .to_string()
    }
}

#[async_trait]
pub trait UsersRepository {
    async fn get(&self, usernname: String) -> anyhow::Result<User>;
    async fn create(&self, new_user: NewUser) -> anyhow::Result<User>;
    async fn update(&self, user: User) -> anyhow::Result<User>;
    async fn delete(&self, username: String) -> anyhow::Result<()>;
}

#[async_trait]
impl UsersRepository for RepositoryForDb {
    async fn get(&self, username: String) -> anyhow::Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            SELECT * FROM users WHERE username = $1
            "#,
        )
        .bind(username)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }

    async fn create(&self, new_user: NewUser) -> anyhow::Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
        )
        .bind(new_user.username)
        .bind(new_user.email)
        .bind(new_user.password)
        .fetch_one(&self.pool)
        .await?;

        dbg!(&user);

        Ok(user)
    }

    async fn update(&self, user: User) -> anyhow::Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users SET username = $1, email = $2, password = $3
            WHERE id = $4
            RETURNING *
            "#,
        )
        .bind(user.username)
        .bind(user.email)
        .bind(user.password)
        .bind(user.id)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }

    async fn delete(&self, username: String) -> anyhow::Result<()> {
        sqlx::query(
            r#"
            DELETE FROM users WHERE username = $1
            "#,
        )
        .bind(username)
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
