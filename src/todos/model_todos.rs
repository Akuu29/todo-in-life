use crate::repository::RepositoryForDb;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{
    types::chrono::{Local, NaiveDateTime},
    FromRow,
};
use std::borrow::Cow;
use validator::{Validate, ValidationError};

#[derive(Debug, Clone, Serialize, Validate, FromRow)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub content: Option<String>,
    pub category: String,
    pub date_limit: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Deserialize, Validate)]
pub struct NewTodo {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(max = 300, message = "Content must be 300 characters or less"))]
    pub content: Option<String>,
    pub category: String,
    #[validate(custom = "validate_past_date")]
    pub date_limit: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct EditTodo {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Title must be between 1 and 50 characters"
    ))]
    pub title: String,
    #[validate(length(max = 300, message = "Content must be 300 characters or less"))]
    pub content: Option<String>,
    pub category: String,
    #[validate(custom = "validate_past_date")]
    pub date_limit: Option<NaiveDateTime>,
}

fn validate_past_date(deadline: &NaiveDateTime) -> Result<(), ValidationError> {
    if deadline < &Local::now().naive_local() {
        let validation_error = ValidationError {
            code: Cow::from("pastDate"),
            message: Some(Cow::from("Deadline mut be entered for a date after today")),
            params: Default::default(),
        };
        return Err(validation_error);
    }

    Ok(())
}

#[async_trait]
pub trait TodosRepository {
    async fn get_todo_by_user_id(&self, user_id: i32) -> anyhow::Result<Vec<Todo>>;
    async fn create_todo(&self, todo: NewTodo, user_id: i32) -> anyhow::Result<Todo>;
    async fn update_todo(&self, todo: EditTodo, todo_id: i32) -> anyhow::Result<Todo>;
    async fn delete_todo(&self, todo_id: i32) -> anyhow::Result<Todo>;
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

    async fn create_todo(&self, todo: NewTodo, user_id: i32) -> anyhow::Result<Todo> {
        let todo: Todo = sqlx::query_as::<_, Todo>(
            r#"
            INSERT INTO todos (title, content, category, date_limit, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            "#,
        )
        .bind(todo.title)
        .bind(todo.content)
        .bind(todo.category)
        .bind(todo.date_limit)
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }

    async fn update_todo(&self, todo: EditTodo, todo_id: i32) -> anyhow::Result<Todo> {
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
        .bind(todo_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }

    async fn delete_todo(&self, todo_id: i32) -> anyhow::Result<Todo> {
        let todo = sqlx::query_as::<_, Todo>(
            r#"
            DELETE FROM todos WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(todo_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(todo)
    }
}
