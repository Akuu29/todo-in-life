use actix_web::{get, post, Scope, Responder, HttpResponse, HttpRequest};
use actix_web::web::{self, Data, Form};
use actix_identity::Identity;
use tera::{Tera, Context};
use diesel::prelude::*;
use validator::Validate;
use argon2::Argon2;
use argon2::password_hash::{PasswordHash, PasswordVerifier};
use crate::users::{NewUser, User};
use crate::users::validate_form::{SignupData, LoginData};
use crate::Pool;
use crate::schema::users;
// use crate::manage_cookie::{get_cookie, set_cookie};

pub fn get_scope() -> Scope {
    web::scope("")
        .service(index)
        .service(app)
        .service(render_login)
        .service(login)
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

#[get("/login")]
async fn render_login(identitiy: Identity, tmpl: Data<Tera>) -> impl Responder {
    // ログイン済みの場合、早期リターン
    if identitiy.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish();
    }

    let response_body = tmpl
        .render("login.html", &Context::new())
        .unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[post("/login")]
async fn login(identity: Identity, pool: Pool, form_data: Form<LoginData>) -> impl Responder {
    // すでにサインアップまたはログイン済みの場合、早期リターン
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish();
    }

    // バリデーション
    if let Err(validation_errors) = form_data.validate() {
// TODO クライアント側でエラー内容をどのように受け取るか
        return HttpResponse::Found()
            .append_header(("location", "/login"))
            .finish()
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user = users::table
        .filter(users::username.eq(&form_data.username))
        .first::<User>(&db_connection);

    match user {
        Ok(user) => {
            // 入力されたパスワードのハッシュ値を保存されているハッシュ値と比較
            let parsed_hash = PasswordHash::new(&user.password).unwrap();
            let is_match = Argon2::default().verify_password(form_data.password.as_bytes(), &parsed_hash);
            match is_match {
                Ok(_) => {
                    // cookieにID保存
                    identity.remember(user.username.clone());
// TODO クライアント側でcookie管理
                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .finish()
                }
                Err(_) => {
                    HttpResponse::Found()
                        .append_header(("location", "/login"))
                        .finish()
                }
            }
        }
        Err(_) => {
            HttpResponse::Found()
                .append_header(("location", "/login"))
                .finish()
        }
    }
}

#[get("/signup")]
async fn render_signup(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // すでにサインアップまたはログイン済みの場合、早期リターン
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish();
    }

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
    let result = web::block(move || {
        diesel::insert_into(users::table).values(&user).execute(&db_connection)
    }).await;

    match result {
        Ok(insert_result) => {
            match insert_result {
                Ok(_) => {
                    // クッキーの発行
                    identity.remember(new_user.username);

                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .finish()
                }
                Err(_) => {
                    HttpResponse::Found()
                        .append_header(("location", "/signup"))
                        .finish()
                }
            }
        }
        Err(_) => {
            HttpResponse::Found()
                .append_header(("location", "/signup"))
                .finish()
        }
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