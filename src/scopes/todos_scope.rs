use actix_web::{get,post, put, patch, delete, Scope, Responder, HttpResponse};
use actix_web::web::{self, Form};
use actix_identity::Identity;
use diesel::prelude::*;
use validator::Validate;
use serde_json::json;
use crate::Pool;
use crate::todos::validate_todos_form::{
    TodoData, 
    EditTodoData, 
    UpdateTodoDataStatus,
    DeleteTodoData
};
use crate::todos::{NewTodo, Todo};
use crate::schema::{users, todos};
use crate::users::User;
use crate::convert_to_date;

pub fn get_scope() -> Scope {
    web::scope("/api")
        .service(get)
        .service(create)
        .service(update)
        .service(update_status)
        .service(delete)
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

#[put("/todos")]
pub async fn update(identity: Identity, pool: Pool, todo_data: Form<EditTodoData>) -> impl Responder {
    // 未ログインの場合、早期リターン
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish(); // 401
    }

    // バリデーション
    if let Err(_validation_errors) = todo_data.validate() {
        return HttpResponse::UnprocessableEntity().finish(); // 422
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(identity.identity().unwrap()))
        .first::<User>(&db_connection)
        .unwrap()
        .id;

    // todoからuser_id取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(todo_data.id.clone()))
        .first::<Todo>(&db_connection);
    let todo_user_id = match get_todo_result {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(), // 403
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish(); // 403
    }

    // todo_data.date_limitをStringからDate型に変換
    let convert_date_limit = todo_data.date_limit.clone()
        .map(|date| convert_to_date(&date));

    let update_result = web::block(move || {
        diesel::update(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .set((
                todos::title.eq(todo_data.title.clone()),
                todos::content.eq(todo_data.content.clone()),
                todos::date_limit.eq(convert_date_limit),
            ))
            .execute(&db_connection)
    }).await;

    match update_result {
        Ok(Ok(_)) => HttpResponse::Ok().json(json!({"status": "200"})),
        _ => HttpResponse::InternalServerError().finish()
    }
}

#[patch("/todos")]
pub async fn update_status(identity: Identity, pool: Pool, todo_data: Form<UpdateTodoDataStatus>) -> impl Responder {
    // 未ログインの場合
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .first::<User>(&db_connection)
        .unwrap()
        .id;
    
    // todoからuser_idを取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(&todo_data.id))
        .first::<Todo>(&db_connection);
    let todo_user_id = match get_todo_result  {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(), // 403
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish(); // 403
    }

    let update_status_result = web::block(move || {
        diesel::update(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .set(
                todos::done.eq(true)
            )
            .execute(&db_connection)
    }).await;

    match update_status_result {
        Ok(Ok(_)) => HttpResponse::Ok().json(json!({"status": "200"})),
        _ => HttpResponse::InternalServerError().finish(), // 500
    }
}

#[delete("/todos")]
pub async fn delete(identity: Identity, pool: Pool, todo_data: Form<DeleteTodoData>) -> impl Responder {
    // 未ログインの場合、早期リターン
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish(); // 401
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .first::<User>(&db_connection)
        .unwrap()
        .id;

    // todoからuser_idを取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(&todo_data.id))
        .first::<Todo>(&db_connection);
    let todo_user_id = match get_todo_result {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(), // 403
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish(); // 403
    }

    let delete_result = web::block(move || {
        diesel::delete(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .execute(&db_connection)
    }).await;

    match delete_result {
        Ok(Ok(_)) => HttpResponse::Ok().json(json!({"status": "201"})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}