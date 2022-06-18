use chrono::{NaiveDateTime, Utc, NaiveDate};
use serde::{Serialize};
use uuid::Uuid;
use crate::schema::todos;
use crate::convert_to_date;

#[derive(Debug, Clone, Queryable, Insertable, Serialize)]
#[table_name="todos"]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDate>,
    pub date_created: NaiveDateTime,
    pub user_id: String,
}

impl Todo {
    pub fn new(
        title: String,
        content: Option<String>,
        category: String,
        date_limit: Option<String>,
        user_id: String
    ) -> Self {
        Todo {
            id: Uuid::new_v4().to_string(),
            title,
            content,
            category,
            date_limit: Todo::convert_date_limit_to_naivedate(date_limit),
            date_created: Utc::now().naive_utc(),
            user_id
        }
    }
    // date_limiitをOption<String>からOption<NaiveDate>に変換して返却する
    fn convert_date_limit_to_naivedate(date_limit: Option<String>) -> Option<NaiveDate> {
        date_limit.map(|date| convert_to_date(&date))
    }
}