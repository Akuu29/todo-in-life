use crate::manage_cookie::{generate_cookie_messages, set_messages_in_cookie};
use crate::schema::users;
use crate::users::{LoginData, NewUser, SignupData, User};
use crate::Pool;
use actix_identity::Identity;
use actix_web::web::{self, Data, Form};
use actix_web::{get, post, HttpRequest, HttpResponse, Responder, Scope};
use argon2::password_hash::{PasswordHash, PasswordVerifier};
use argon2::Argon2;
use diesel::prelude::*;
use tera::{Context, Tera};
use validator::Validate;

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
async fn index(req: HttpRequest, identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    let response_body = tmpl.render("index.html", &Context::new()).unwrap();

    // 未ログインの場合、cookie_messagesの初期化
    if identity.identity().is_none() {
        let cookie_messages = generate_cookie_messages(&req);
        return HttpResponse::Ok()
            .cookie(cookie_messages)
            .content_type("text/html")
            .body(response_body);
    }

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[get("/app")]
async fn app(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // 未ログインの場合、エラー
    if identity.identity().is_none() {
        return HttpResponse::NotFound().finish();
    }

    let response_body = tmpl.render("app.html", &Context::new()).unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[get("/login")]
async fn render_login(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // サインアップ済みまたはログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found()
            .append_header(("location", "/"))
            .finish();
    }

    let response_body = tmpl.render("login.html", &Context::new()).unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[post("/login")]
async fn login(
    req: HttpRequest,
    identity: Identity,
    pool: Pool,
    form_data: Form<LoginData>,
) -> impl Responder {
    // ログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found()
            .append_header(("location", "/"))
            .finish();
    }

    // cookie_messagesの生成
    let mut cookie_messages = generate_cookie_messages(&req);

    // バリデーション
    if let Err(validation_errors) = form_data.validate() {
        // エラーメッセージをcookieに設定
        validation_errors
            .field_errors()
            .iter()
            .for_each(|(_, fields)| {
                fields.iter().for_each(|validation_error| {
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "login".to_string(),
                        "error".to_string(),
                        validation_error.message.as_ref().unwrap().to_string(),
                    );
                })
            });
        return HttpResponse::Found()
            .append_header(("location", "/login"))
            .cookie(cookie_messages)
            .finish();
    }

    let mut db_connection = pool.get().expect("Failed getting db connection");

    let result = users::table
        .filter(users::username.eq(&form_data.username))
        .first::<User>(&mut db_connection);

    match result {
        Ok(login_user) => {
            // 入力されたパスワードのハッシュ値を保存されているハッシュ値と比較
            let parsed_hash = PasswordHash::new(&login_user.password).unwrap();
            let is_match =
                Argon2::default().verify_password(form_data.password.as_bytes(), &parsed_hash);
            match is_match {
                Ok(_) => {
                    // cookieにID保存
                    identity.remember(login_user.username);

                    // cookieにメッセージを保存
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "login".to_string(),
                        "success".to_string(),
                        "Successfully logged in".to_string(),
                    );

                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .cookie(cookie_messages)
                        .finish()
                }
                Err(_) => {
                    // cookieにメッセージを保存
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "login".to_string(),
                        "error".to_string(),
                        "Username or password of both are incorrect".to_string(),
                    );

                    HttpResponse::Found()
                        .append_header(("location", "/login"))
                        .cookie(cookie_messages)
                        .finish()
                }
            }
        }
        Err(_) => {
            // cookieにメッセージを保存
            set_messages_in_cookie(
                &mut cookie_messages,
                "login".to_string(),
                "error".to_string(),
                "Username or password of both are incorrect".to_string(),
            );

            HttpResponse::Found()
                .append_header(("location", "/login"))
                .cookie(cookie_messages)
                .finish()
        }
    }
}

#[get("/signup")]
async fn render_signup(identity: Identity, tmpl: Data<Tera>) -> impl Responder {
    // サインアップ済みまたはログイン済みの場合、エラー
    if identity.identity().is_some() {
        return HttpResponse::Found()
            .append_header(("location", "/"))
            .finish();
    }

    let response_body = tmpl.render("signup.html", &Context::new()).unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[post("/signup")]
async fn signup(
    req: HttpRequest,
    pool: Pool,
    identity: Identity,
    form_data: Form<SignupData>,
) -> impl Responder {
    // ログイン済みの場合、早期リターン
    if identity.identity().is_some() {
        return HttpResponse::Found()
            .append_header(("location", "/"))
            .finish();
    }

    // cookie_messagesの生成
    let mut cookie_messages = generate_cookie_messages(&req);

    // バリデーション
    if let Err(validation_errors) = form_data.validate() {
        validation_errors
            .field_errors()
            .iter()
            .for_each(|(_, fields)| {
                fields.iter().for_each(|validation_error| {
                    // エラーメッセージをcookieに保存
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "signup".to_string(),
                        "error".to_string(),
                        validation_error.message.as_ref().unwrap().to_string(),
                    );
                })
            });

        return HttpResponse::Found()
            .append_header(("location", "/signup"))
            .cookie(cookie_messages)
            .finish();
    }

    // 登録用のユーザーの生成
    let new_user = NewUser::new(form_data);

    let mut db_connection = pool.get().expect("Failed getting db connection");

    // インサート結果が返ってくるまでブロック
    let result = web::block(move || {
        diesel::insert_into(users::table)
            .values(new_user)
            .get_result::<User>(&mut db_connection)
    })
    .await;

    match result {
        Ok(insert_result) => {
            match insert_result {
                Ok(insert_user) => {
                    // cookieにID保存
                    identity.remember(insert_user.username);

                    // cookieにメッセージを保存
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "signup".to_string(),
                        "success".to_string(),
                        "Successfully sign up".to_string(),
                    );

                    HttpResponse::Found()
                        .append_header(("location", "/app"))
                        .cookie(cookie_messages)
                        .finish()
                }
                Err(_) => {
                    // cookieにメッセージを保存
                    set_messages_in_cookie(
                        &mut cookie_messages,
                        "signup".to_string(),
                        "error".to_string(),
                        "Username or email or both are already registered".to_string(),
                    );

                    HttpResponse::Found()
                        .append_header(("location", "/signup"))
                        .cookie(cookie_messages)
                        .finish()
                }
            }
        }
        Err(_) => {
            // cookieにメッセージを保存
            set_messages_in_cookie(
                &mut cookie_messages,
                "signup".to_string(),
                "error".to_string(),
                "Username or email or both are already registered".to_string(),
            );

            HttpResponse::Found()
                .append_header(("location", "/signup"))
                .cookie(cookie_messages)
                .finish()
        }
    }
}

#[get("/logout")]
async fn logout(identity: Identity) -> impl Responder {
    // 未ログインの場合エラー
    if identity.identity().is_none() {
        return HttpResponse::NotFound().finish();
    }

    // ID破棄
    identity.forget();

    HttpResponse::Found()
        .append_header(("location", "/"))
        .finish()
}
