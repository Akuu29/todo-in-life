use actix_web::{get, post, Scope, Responder, HttpResponse, HttpRequest};
use actix_web::web::{self, Data, Form};
use actix_identity::Identity;
use tera::{Tera, Context};
use diesel::prelude::*;
use validator::Validate;
// use argon2::Argon2;
// use argon2::password_hash::rand_core::OsRng;
// use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use crate::users::{NewUser};
use crate::users::validate_form::{SignupData};
use crate::Pool;
use crate::schema::users;
// use crate::manage_cookie::{get_cookie, set_cookie};

pub fn get_scope() -> Scope {
    web::scope("")
        .service(index)
        .service(render_signup)
        .service(signup)
        .service(logout)
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

#[get("/app")]
async fn app(identitiy: Identity, tmpl: Data<Tera>) -> impl Responder {
    // 未ログインの場合早期リターン
    if identitiy.identity().is_none() {
        return HttpResponse::NotFound().finish();
    }

    let response_body = tmpl
        .render("app.html", &Context::new())
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
async fn signup(req: HttpRequest, pool: Pool, identity: Identity,form_data: Form<SignupData>) -> impl Responder {
    // すでにサインアップまたはログイン済みの場合、早期リターン
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish();
    }

    // バリデーション
    if let Err(validation_errors) = form_data.validate() {
// TODO クライアント作成後cookieでエラー管理
        // validation_errors.field_errors().iter().for_each(|(_, errors)| {
        //     errors.iter().for_each(|validation_error| {
                
        //     })
        // });
        return HttpResponse::Found()
            .append_header(("location", "/signup"))
            .finish();
    }
    
    let signup_data = form_data.into_inner();
// TODO: NewUserを作る一手間が発生している
    let new_user = NewUser {
        username: signup_data.username,
        email: signup_data.email,
        password: signup_data.password,
    };
    
    let user = NewUser::create_user(&new_user);

    let db_connection = pool.get().expect("Failed getting db connection");

    // インサート結果が返ってくるまでブロック
    let insert_result = web::block(move || {
        diesel::insert_into(users::table).values(&user).execute(&db_connection)
    }).await;

    match insert_result {
        Ok(_) => {
            // クッキーの発行
            identity.remember(new_user.username);
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
#[get("/logout")]
async fn logout(identity: Identity) -> impl Responder{
    // 未ログインの場合早期リターン
    if identity.identity().is_none() {
        return HttpResponse::NotFound().finish();
    }

    // cookie破棄
    identity.forget();

    HttpResponse::Found()
        .append_header(("location", "/"))
        .finish()
}