use chrono::{NaiveDateTime, Utc, NaiveDate};
use serde::{Serialize};
use uuid::Uuid;
use crate::schema::todos;
use crate::convert_to_date;

pub struct NewTodo {
    pub title: String,
    pub content: Option<String>,
    pub category: Option<String>,
    pub date_limit: Option<String>,
}

#[derive(Debug, Clone, Queryable, Insertable, Serialize)]
#[table_name="todos"]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDate>,
    pub done: bool,
    pub date_created: NaiveDateTime,
    pub user_id: String,
}

impl NewTodo {
    // リクエストからTodo構造体を作成
    pub fn create_todo(&self, id: String) -> Todo {
        Todo {
            id: Uuid::new_v4().to_string(),
            title: self.title.clone(),
            content: self.content.clone(),
            category: self.return_category(),
            date_limit: self.convert_date_limit_to_navidate(),
            done: false,
            date_created: Utc::now().naive_utc(),
            user_id: id
        }
    }
    fn return_category(&self) -> String {
        match self.category.clone() {
            Some(category) => category,
            None => "short".to_string()
        }
    }
    // date_limiitをStringからNaiveDateに変換して返却する
    fn convert_date_limit_to_navidate(&self) -> Option<NaiveDate> {
        self.date_limit.clone()
            .map(|date| convert_to_date(&date))
    }
}