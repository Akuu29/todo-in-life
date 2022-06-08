use actix_web::{get, post, Scope, Responder, HttpResponse, HttpRequest};
use actix_web::web::{self, Data, Form};
use actix_identity::Identity;
use tera::{Tera, Context};
use diesel::prelude::*;
use validator::Validate;
use argon2::Argon2;
use argon2::password_hash::{PasswordHash, PasswordVerifier};
use crate::users::{NewUser, User};
use crate::users::validate_users_form::{SignupData, LoginData};
use crate::Pool;
use crate::schema::users;
use crate::manage_cookie::{generate_cookie_messages, set_messages_in_cookie};

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
        .body(response_body) // 200
}

#[get("/app")]
async fn app(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::NotFound().finish(); // 404
    }

    let response_body = tmpl
        .render("app.html", &Context::new())
        .unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body) // 200
}

#[get("/login")]
async fn render_login(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // サインアップ済みまたはログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish(); // 302
    }

    let response_body = tmpl
        .render("login.html", &Context::new())
        .unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body) // 200
}

#[post("/login")]
async fn login(req: HttpRequest, identity: Identity, pool: Pool, user_data: Form<LoginData>) -> impl Responder {
    // サインアップ済みまたはログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish(); // 302
    }

    // cookie_messagesの生成
    let mut cookie_messages = generate_cookie_messages(&req);

    // バリデーション
    if let Err(validation_errors) = user_data.validate() {
        // エラーメッセージをcookieに設定
        validation_errors.field_errors().iter().for_each(|(_, fields)| {
            fields.iter().for_each(|validation_error| {
                set_messages_in_cookie(
                    &mut cookie_messages,
                    "error".to_string(),
                    validation_error.message.as_ref().unwrap().to_string(),
                );
            })
        });
        return HttpResponse::Found()
            .append_header(("location", "/login"))
            .cookie(cookie_messages)
            .finish()
    }

    let db_connection = pool.get().expect("Failed getting db connection");

    let user = users::table
        .filter(users::username.eq(&user_data.username))
        .first::<User>(&db_connection);

    match user {
        Ok(user) => {
            // 入力されたパスワードのハッシュ値を保存されているハッシュ値と比較
            let parsed_hash = PasswordHash::new(&user.password).unwrap();
            let is_match = Argon2::default().verify_password(user_data.password.as_bytes(), &parsed_hash);
            match is_match {
                Ok(_) => {
                    // cookieにID保存
                    identity.remember(user.username.clone());
// TODO クライアント側でcookie管理
                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .finish() // 302
                }
                Err(_) => {
                    HttpResponse::Found()
                        .append_header(("location", "/login"))
                        .finish() // 302
                }
            }
        }
        Err(_) => {
            HttpResponse::Found()
                .append_header(("location", "/login"))
                .finish() // 302
        }
    }
}

#[get("/signup")]
async fn render_signup(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // サインアップ済みまたはログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish(); // 302
    }

    let response_body = tmpl
        .render("signup.html", &Context::new())
        .unwrap();
    
    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body) // 200
}

#[post("/signup")]
async fn signup(req: HttpRequest, pool: Pool, identity: Identity,form_data: Form<SignupData>) -> impl Responder {
    // サインアップまたはログイン済みの場合、早期リターン
    if identity.identity().is_some() {
        return HttpResponse::Found().append_header(("location", "/")).finish(); // 302
    }

    // バリデーション
    if let Err(validation_errors) = form_data.validate() {
// TODO クライアント側でエラー内容をどのように受け取るか
        // validation_errors.field_errors().iter().for_each(|(_, errors)| {
        //     errors.iter().for_each(|validation_error| {
                
        //     })
        // });
        return HttpResponse::Found()
            .append_header(("location", "/signup"))
            .finish(); // 302
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

    // ブロック、インサートのResultで二重にラップされている
    match result {
        Ok(insert_result) => {
            match insert_result {
                Ok(_) => {
                    // cookieにID保存
                    identity.remember(new_user.username);

                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .finish() // 302
                }
                Err(_) => {
                    HttpResponse::Found()
                        .append_header(("location", "/signup"))
                        .finish() // 302
                }
            }
        }
        Err(_) => {
            HttpResponse::Found()
                .append_header(("location", "/signup"))
                .finish() // 302
        }
    }
}

#[get("/logout")]
async fn logout(identity: Identity) -> impl Responder{
    // 未ログインの場合エラー
    if identity.identity().is_none() {
        return HttpResponse::NotFound().finish(); // 404
    }

    // ID破棄
    identity.forget();

    HttpResponse::Found()
        .append_header(("location", "/"))
        .finish() // 302
}