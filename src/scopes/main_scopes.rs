use actix_web::{get, post, Scope, Responder, HttpResponse};
use actix_web::web::{self, Data, Form};
use tera::{Tera, Context};
use diesel::prelude::*;
// use argon2::Argon2;
// use argon2::password_hash::rand_core::OsRng;
// use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use crate::users::{NewUser};
use crate::Pool;
use crate::schema::users;

pub fn get_scope() -> Scope {
    web::scope("")
        .service(index)
        .service(render_signup)
        .service(signup)
}

#[get("/")]
async fn index(tmpl: Data<Tera>) -> impl Responder {
    let response_body = tmpl
        .render("index.html", &Context::new())
        .unwrap();
    
    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[get("/signup")]
async fn render_signup(tmpl: Data<Tera>) -> impl Responder {
    let response_body = tmpl
        .render("signup.html", &Context::new())
        .unwrap();
    
    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[post("/signup")]
async fn signup(pool: Pool, form_data: Form<NewUser>) -> impl Responder {
    let new_user = form_data.into_inner();
    
    let user = NewUser::create_user(new_user);

    let db_connection = pool.get().expect("Failed getting db connection");

    match web::block(move || {
        diesel::insert_into(users::table).values(&user).execute(&db_connection)
    })
    .await
    {
        Ok(_) => {

            // 戻り先は後変更。
            HttpResponse::Found()
                .append_header(("location", "/"))
                .finish()
        }
        Err(_) => {

            HttpResponse::Found()
                .append_header(("location", "/signup"))
                .finish()
        }
    }
}