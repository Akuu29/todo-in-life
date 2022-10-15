use actix_web::{get, post, put, patch, delete, Scope, Responder, HttpResponse};
use actix_web::web::{self, Json, Query};
use actix_identity::Identity;
use diesel::prelude::*;
use validator::Validate;
use serde_json::json;
use crate::Pool;
use crate::todos::{
    Todo,
    NewTodo,
    TodoForCreate,
    TodoForEdit,
    TodoForUpdateStatus,
    TodoForDelete
};
use crate::schema::{users, todos};
use crate::users::User;
use crate::convert_to_date;

pub fn get_scope() -> Scope {
    web::scope("/api")
        .service(get)
        .service(create)
        .service(update)
        .service(update_category)
        .service(delete)
}

#[get("/todos")]
pub async fn get(identity: Identity, pool: Pool) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .get_result::<User>(&mut db_connection)
        .unwrap()
        .id;

    let get_todos_result = todos::table
        .filter(todos::user_id.eq(user_id))
        .order(todos::date_created)
        .get_results::<Todo>(&mut db_connection);

    match get_todos_result {
        Ok(todos) => HttpResponse::Ok().json(json!({"status": "success", "todos": todos})),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}


#[post("/todos")]
pub async fn create(identity: Identity, pool: Pool, todo_data: Json<TodoForCreate>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    // バリデーション
    if let Err(validation_errors) = todo_data.validate() {
        return HttpResponse::UnprocessableEntity()
            .json(json!({"status": "error", "validationErrors": validation_errors.field_errors()}));
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .get_result::<User>(&mut db_connection)
        .unwrap()
        .id;

    let new_todo = NewTodo::new(todo_data, user_id);

    let create_todo_result = web::block(move || {
        diesel::insert_into(todos::table)
            .values(new_todo)
            .get_result::<Todo>(&mut db_connection)
    }).await;

    match create_todo_result {
        // ブロック、インサートのResultで二重にラップされている
        Ok(Ok(todo)) => HttpResponse::Created().json(json!({"status": "success", "todo": todo})),
        _ => HttpResponse::InternalServerError().finish()
    }
}

#[put("/todos")]
pub async fn update(identity: Identity, pool: Pool, todo_data: Json<TodoForEdit>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    // バリデーション
    if let Err(validation_errors) = todo_data.validate() {
        return HttpResponse::UnprocessableEntity()
            .json(json!({"status": "error", "validationErrors": validation_errors.field_errors()}));
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(identity.identity().unwrap()))
        .get_result::<User>(&mut db_connection)
        .unwrap()
        .id;

    // todoからuser_id取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(todo_data.id))
        .get_result::<Todo>(&mut db_connection);
    let todo_user_id = match get_todo_result {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(),
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish();
    }

    // date_limitをOption<NaiveDate>に変換
    let convert_date_limit_to_naivedate = todo_data.date_limit.clone()
        .map(|date| convert_to_date(&date));

    let edit_todo_result = web::block(move || {
        diesel::update(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .set((
                todos::title.eq(todo_data.title.clone()),
                todos::content.eq(todo_data.content.clone()),
                todos::category.eq(todo_data.category.clone()),
                todos::date_limit.eq(convert_date_limit_to_naivedate),
            ))
            .get_result::<Todo>(&mut db_connection)
    }).await;

    match edit_todo_result {
        // ブロック、アップデートのResultで二重にラップされている
        Ok(Ok(todo)) => HttpResponse::Ok().json(json!({"status": "success", "todoEdited": todo})),
        _ => HttpResponse::InternalServerError().finish()
    }
}

#[patch("/todos")]
pub async fn update_category(identity: Identity, pool: Pool, todo_data: Json<TodoForUpdateStatus>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .get_result::<User>(&mut db_connection)
        .unwrap()
        .id;

    // todoからuser_idを取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(&todo_data.id))
        .get_result::<Todo>(&mut db_connection);
    let todo_user_id = match get_todo_result  {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(),
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish();
    }

    let update_todo_status_result = web::block(move || {
        diesel::update(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .set(
                todos::category.eq(&todo_data.category)
            )
            .get_result::<Todo>(&mut db_connection)
    }).await;

    match update_todo_status_result {
        // ブロック、アップデートのResultで二重にラップされている
        Ok(Ok(_)) => HttpResponse::Ok().json(json!({"status": "success"})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/todos")]
pub async fn delete(identity: Identity, pool: Pool, todo_data: Query<TodoForDelete>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let user_id = users::table
        .filter(users::username.eq(&identity.identity().unwrap()))
        .get_result::<User>(&mut db_connection)
        .unwrap()
        .id;

    // todoからuser_idを取得
    let get_todo_result = todos::table
        .filter(todos::id.eq(&todo_data.id))
        .get_result::<Todo>(&mut db_connection);
    let todo_user_id = match get_todo_result {
        Ok(todo) => todo.user_id,
        Err(_) => return HttpResponse::Forbidden().finish(),
    };

    // user_id と todo_user_idが一致しない場合エラー
    if user_id != todo_user_id {
        return HttpResponse::Forbidden().finish();
    }

    let delete_result = web::block(move || {
        diesel::delete(todos::table.filter(todos::id.eq(&todo_data.id).and(todos::user_id.eq(user_id))))
            .get_result::<Todo>(&mut db_connection)
    }).await;

    match delete_result {
        // ブロック、デリートのResultで二重にラップされている
        Ok(Ok(todo)) => HttpResponse::Ok().json(json!({"status": "success", "todoDeleted": todo})),
        _ => HttpResponse::InternalServerError().finish(),
    }
}