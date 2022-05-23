use uuid::Uuid;
use chrono::{NaiveDateTime, Utc};
use argon2::Argon2;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHasher, SaltString};
use crate::schema::users;

#[derive(Debug)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Queryable, Insertable)]
#[table_name="users"]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub password: String,
    pub date_created: NaiveDateTime,
}

// リクエストからUserを作成
// ※MySqlをv8にアップグレード後、uuidの生成をやめ、DB側で生成するように変更する
impl NewUser {
    pub fn create_user(&self) -> User {
        User {
            id: Uuid::new_v4().to_string(),
            username: self.username.clone(),
            email: self.email.clone(),
            password: NewUser::hash_password(self.password.clone()),
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