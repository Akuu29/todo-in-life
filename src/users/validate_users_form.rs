use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Validate, Deserialize)]
pub struct SignupData {
    #[validate(length(
        min = 4,
        max = 32,
        message = "Username must be between 4 and 32 characters"
    ))]
    pub username: String,
    #[validate(email(
        message = "Email address entered is invalid"
    ))]
    pub email: String,
    #[validate(length(
        min = 8,
        max = 32,
        message = "Password must be between 8 and 32 characters"
    ))]
    pub password: String,
}

#[derive(Debug, Validate, Deserialize)]
pub struct LoginData {
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
