use actix_web::{get, post, Scope, Responder, HttpResponse};
use actix_web::web::{self, Form};
use actix_identity::Identity;
use diesel::prelude::*;
use validator::Validate;
use serde_json::json;
use crate::Pool;
use crate::todos::validate_todos_form::TodoData;
use crate::todos::{NewTodo, Todo};
use crate::schema::{users, todos};
use crate::users::User;

pub fn get_scope() -> Scope {
    web::scope("/api")
        .service(get)
        .service(create)
}

#[get("/todos")]
pub async fn get(identitiy: Identity, pool: Pool) -> impl Responder {
    // 未ログイン場合、早期リターン
    if identitiy.identity().is_none() {
        return HttpResponse::Unauthorized().finish(); // 401
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identitiy.identity().unwrap()))
        .first::<User>(&db_connection)
        .unwrap()
        .id;

    let todos = todos::table
        .filter(todos::user_id.eq(user_id))
        .order(todos::date_created)
        .first::<Todo>(&db_connection)
        .unwrap();
    
    HttpResponse::Ok().json(todos)
}


#[post("/todos")]
pub async fn create(identitiy: Identity, pool: Pool, todo_data: Form<TodoData>) -> impl Responder {
    // 未ログインの場合、早期リターン
    if identitiy.identity().is_none() {
        return HttpResponse::Unauthorized().finish(); // 401
    }

    // バリデーション
    if let Err(_validation_errors) = todo_data.validate() {
        return HttpResponse::UnprocessableEntity().finish(); // 422
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identitiy.identity().unwrap()))
        .first::<User>(&db_connection)
        .unwrap()
        .id;

    let new_todo = NewTodo {
        title: todo_data.title.clone(),
        content: todo_data.content.clone(),
        category: todo_data.category.clone(),
        date_limit: todo_data.date_limit.clone(),
    };

    let todo = NewTodo::create_todo(&new_todo, user_id);

    let result = web::block(move || {
        diesel::insert_into(todos::table)
            .values(&todo)
            .execute(&db_connection)
    }).await;

    match result {
// TODO insertされたTodo構造対をレスポンスにjsonでセットしたい。
        // Ok(Ok(_)) => HttpResponse::Created().json(),
        Ok(Ok(_)) => HttpResponse::Created().json(json!({"status": "201"})),
        _ => HttpResponse::InternalServerError().finish(), // 500
    }
}