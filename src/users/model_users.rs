use actix_web::web::Form;
use uuid::Uuid;
use chrono::NaiveDateTime;
use argon2::Argon2;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHasher, SaltString};
use crate::schema::users;
use crate::users::SignupData;

#[derive(Debug, Clone, Queryable)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
    pub date_created: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

impl NewUser {
    pub fn new(form_data: Form<SignupData>) -> Self {
        NewUser {
            username: form_data.username.clone(),
            email: form_data.email.clone(),
            password: NewUser::convert_hash_password(form_data.password.clone())
        }
    }
    // パスワードを文字列からハッシュに変換
    fn convert_hash_password(password: String) -> String {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();

        argon2.hash_password(password.as_bytes(), &salt)
            .unwrap()
            .to_string()
    }
}
