use crate::repository::RepositoryForDb;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{
    types::chrono::{Local, NaiveDateTime},
    FromRow,
};
use std::borrow::Cow;
use validator::{Validate, ValidationError};

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub user_id: i32,
}

#[derive(Debug)]
pub struct NewTodo {
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDateTime>,
    pub user_id: i32,
}

impl NewTodo {
    pub fn new(todo: TodoForCreate, user_id: i32) -> Self {
        let date_limit = match todo.date_limit {
            Some(date_limit) => {
                let date_limit_str = format!("{} 00:00:00", date_limit);
                Some(NaiveDateTime::parse_from_str(&date_limit_str, "%Y-%m-%d %H:%M:%S").unwrap())
            }
            None => None,
        };

        Self {
            title: todo.title,
            content: todo.content,
            category: todo.category,
            date_limit,
            user_id,
        }
    }
}

#[derive(Debug, Validate, Deserialize)]
pub struct TodoForCreate {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(max = 300, message = "Category must be 300 characters or less"))]
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
pub struct TodoForUpdate {
    pub id: i32,
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(max = 300, message = "Category must be 300 characters or less"))]
    pub content: Option<String>,
    pub category: String,
    // #[validate(
    //     length(
    //         min = 10,
    //         max = 10,
    //         message = "Deadline must be entered in the format 'yyyy/MM//dd'"
    //     ),
    //     custom = "validate_past_date"
    // )]
    pub date_limit: Option<NaiveDateTime>,
}

fn validate_past_date(date_limit: &str) -> Result<(), ValidationError> {
    let date_limit_str = format!("{} 00:00:00", date_limit);
    let date_limit_naive_date_time =
        NaiveDateTime::parse_from_str(&date_limit_str, "%Y-%m-%d %H:%M:%S").unwrap();
    let today = Local::now();

    if date_limit_naive_date_time < today.naive_local() {
        let validation_error = ValidationError {
            code: Cow::from("pastDate"),
            message: Some(Cow::from("Deadline mut be entered for a date after today")),
            params: Default::default(),
        };
        return Err(validation_error);
    }

    Ok(())
}

#[derive(Debug, Deserialize)]
pub struct TodoForUpdateStatus {
    pub id: i32,
    pub category: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TodoForDelete {
    pub id: i32,
}

#[async_trait]
pub trait TodosRepository {
    async fn get_todo_by_user_id(&self, user_id: i32) -> anyhow::Result<Vec<Todo>>;
    async fn create_todo(&self, new_todo: NewTodo) -> anyhow::Result<Todo>;
    async fn update_todo(&self, todo: TodoForUpdate) -> anyhow::Result<Todo>;
    async fn update_todo_status(&self, todo: TodoForUpdateStatus) -> anyhow::Result<()>;
    async fn delete_todo(&self, todo: TodoForDelete) -> anyhow::Result<Todo>;
}

#[async_trait]
impl TodosRepository for RepositoryForDb {
    async fn get_todo_by_user_id(&self, user_id: i32) -> anyhow::Result<Vec<Todo>> {
        let todos = sqlx::query_as::<_, Todo>(
            r#"
            SELECT
                id,
                title,
                content,
                category,
                date_limit,
                created_at,
                updated_at,
                user_id
            FROM todos
            WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(todos)
    }
    async fn create_todo(&self, new_todo: NewTodo) -> anyhow::Result<Todo> {
        let todo = sqlx::query_as::<_, Todo>(
            r#"
            INSERT INTO todos (title, content, category, date_limit, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            "#,
        )
        .bind(new_todo.title)
        .bind(new_todo.content)
        .bind(new_todo.category)
        .bind(new_todo.date_limit)
        .bind(new_todo.user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }
    async fn update_todo(&self, todo: TodoForUpdate) -> anyhow::Result<Todo> {
        dbg!(&todo);
        let todo = sqlx::query_as::<_, Todo>(
            r#"
            UPDATE todos SET title = $1, content = $2, category = $3, date_limit = $4
            WHERE id = $5
            RETURNING *
            "#,
        )
        .bind(todo.title)
        .bind(todo.content)
        .bind(todo.category)
        .bind(todo.date_limit)
        .bind(todo.id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }
    async fn update_todo_status(&self, todo: TodoForUpdateStatus) -> anyhow::Result<()> {
        sqlx::query(
            r#"
            UPDATE todos SET category = $1
            WHERE id = $2
            "#,
        )
        .bind(todo.category)
        .bind(todo.id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }
    async fn delete_todo(&self, todo: TodoForDelete) -> anyhow::Result<Todo> {
        let todo = sqlx::query_as::<_, Todo>(
            r#"
            DELETE FROM todos WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(todo.id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }
}
