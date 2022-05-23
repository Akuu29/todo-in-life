use serde::Deserialize;
use validator::{Validate, ValidationError};
use chrono::{Utc};
use crate::{convert_to_date};

#[derive(Debug, Validate, Deserialize)]
pub struct TodoData {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(
        max = 300,
        message = "Category must be 300 characters or less"
    ))]
    pub content: Option<String>,
    pub category: Option<String>,
    #[validate(
        length(min = 8, max = 8, message = ""),
        custom = "validate_past_date"
    )]
    pub date_limit: Option<String>,
}

#[derive(Debug, Validate, Deserialize)]
pub struct EditTodoData {
    pub id: String,
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(
        max = 300,
        message = "Category must be 300 characters or less"
    ))]
    pub content: Option<String>,
    pub category: Option<String>,
    #[validate(
        length(min = 8, max = 8, message = ""),
        custom = "validate_past_date"
    )]
    pub date_limit: Option<String>,
}

// date_limitに過去日が入力された場合、NGとする
fn validate_past_date(date_limit: &str) -> Result<(), ValidationError>{
    let date = convert_to_date(date_limit);
    let today = Utc::today().naive_utc();
    let duration = date - today;
    if duration.num_days() < 0 {
        return Err(ValidationError::new("past_date"));
    }

    Ok(())
}

#[derive(Debug, Deserialize)]
pub struct UpdateTodoDataStatus {
    pub id: String,
    pub status: bool,
}