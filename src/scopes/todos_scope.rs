use crate::repository::RepositoryForDb;
use crate::todos::{EditTodo, NewTodo, TodosRepository};
use crate::users::UsersRepository;
use actix_identity::Identity;
use actix_web::web;
use actix_web::{delete, get, post, put, HttpResponse, Responder, Scope};
use serde_json::json;
use validator::Validate;

pub fn get_scope() -> Scope {
    web::scope("/api")
        .service(get)
        .service(create)
        .service(update)
        .service(delete)
}

#[get("/todos")]
pub async fn get(user: Option<Identity>, repository: web::Data<RepositoryForDb>) -> impl Responder {
    if user.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let user_id = repository
        .get(user.unwrap().id().unwrap())
        .await
        .expect("Failed getting user_id")
        .id;

    let result = repository.get_todo_by_user_id(user_id).await;

    match result {
        Ok(todos) => HttpResponse::Ok().json(json!({"status": "success", "todos": todos})),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/todos")]
pub async fn create(
    user: Option<Identity>,
    repository: web::Data<RepositoryForDb>,
    web::Json(payload): web::Json<NewTodo>,
) -> impl Responder {
    if user.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    if let Err(validation_errors) = payload.validate() {
        return HttpResponse::UnprocessableEntity().json(
            json!({"status": "error", "validationErrors": validation_errors.field_errors()}),
        );
    }

    let user_id = repository
        .get(user.unwrap().id().unwrap())
        .await
        .expect("Failed getting user_id")
        .id;

    let result = repository.create_todo(payload, user_id).await;

    match result {
        Ok(todo) => HttpResponse::Created().json(json!({"status": "success", "todo": todo})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}

#[put("/todos/{todo_id}")]
pub async fn update(
    user: Option<Identity>,
    repository: web::Data<RepositoryForDb>,
    todo_id: web::Path<i32>,
    web::Json(payload): web::Json<EditTodo>,
) -> impl Responder {
    if user.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    if let Err(validation_errors) = payload.validate() {
        return HttpResponse::UnprocessableEntity().json(
            json!({"status": "error", "validationErrors": validation_errors.field_errors()}),
        );
    }

    let result = repository.update_todo(payload, todo_id.into_inner()).await;

    match result {
        Ok(todo) => HttpResponse::Ok().json(json!({"status": "success", "todoEdited": todo})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/todos/{todo_id}")]
pub async fn delete(
    user: Option<Identity>,
    repository: web::Data<RepositoryForDb>,
    todo_id: web::Path<i32>,
) -> impl Responder {
    if user.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let result = repository.delete_todo(todo_id.into_inner()).await;

    match result {
        Ok(todo) => HttpResponse::Ok().json(json!({"status": "success", "todoDeleted": todo})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}
