use std::borrow::Cow;
use serde::{Deserialize, Serialize};
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
    pub category: String,
    #[validate(
        length(
            min = 10,
            max = 10,
            message = "Deadline must be entered in the format 'yyyy/MM//dd'"
        ),
        custom = "validate_past_date"
    )]
    pub date_limit: Option<String>,
}

#[derive(Debug, Clone, Validate, Deserialize, Serialize)]
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
    pub category: String,
    #[validate(
        length(
            min = 10,
            max = 10,
            message = "Deadline must be entered in the format 'yyyy/MM//dd'"
        ),
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
        let validation_error = ValidationError {
            code: Cow::from("pastDate"),
            message: Some(Cow::from("Deadline mut be entered for a date after today")),
            params: Default::default()
        };
        return Err(validation_error);
    }

    Ok(())
}

#[derive(Debug, Deserialize)]
pub struct UpdateTodoDataStatus {
    pub id: String,
    pub category: String,
}

#[derive(Deserialize, Clone, Serialize)]
pub struct DeleteTodoData {
    pub id: String,
}