use crate::convert_to_date;
use crate::schema::todos;
use crate::todos::TodoForCreate;
use actix_web::web::Json;
use chrono::{NaiveDate, NaiveDateTime};
use diesel::prelude::*;
use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Clone, Queryable, Serialize)]
pub struct Todo {
    pub id: Uuid,
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDate>,
    pub date_created: NaiveDateTime,
    pub user_id: Uuid,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = todos)]
pub struct NewTodo {
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDate>,
    pub user_id: Uuid,
}

impl NewTodo {
    pub fn new(todo_data: Json<TodoForCreate>, user_id: Uuid) -> Self {
        NewTodo {
            title: todo_data.title.clone(),
            content: todo_data.content.clone(),
            category: todo_data.category.clone(),
            date_limit: NewTodo::convert_date_limit_to_naivedate(todo_data.date_limit.clone()),
            user_id,
        }
    }
    // date_limiitをOption<String>からOption<NaiveDate>に変換して返却する
    fn convert_date_limit_to_naivedate(date_limit: Option<String>) -> Option<NaiveDate> {
        date_limit.map(|date| convert_to_date(&date))
    }
}
