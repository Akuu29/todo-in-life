use crate::manage_cookie::{generate_cookie_messages, set_messages_in_cookie};
use crate::repository::RepositoryForDb;
use crate::users::{LoginUser, NewUser, SignupUser, UsersRepository};
use actix_identity::Identity;
use actix_web::web;
use actix_web::{get, post, HttpMessage, HttpRequest, HttpResponse, Responder, Scope};
use argon2::password_hash::{PasswordHash, PasswordVerifier};
use argon2::Argon2;
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
async fn index(req: HttpRequest, user: Option<Identity>, tmpl: web::Data<Tera>) -> impl Responder {
    let response_body = tmpl.render("top.html", &Context::new()).unwrap();
    if user.is_some() {
        return HttpResponse::Ok()
            .content_type("text/html")
            .body(response_body);
    }

    let cookie_messages = generate_cookie_messages(&req);
    HttpResponse::Ok()
        .cookie(cookie_messages)
        .content_type("text/html")
        .body(response_body)
}

#[get("/app")]
async fn app(user: Option<Identity>, tmpl: web::Data<Tera>) -> impl Responder {
    if user.is_none() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/login"))
            .finish();
    }

    let response_body = tmpl.render("todos.html", &Context::new()).unwrap();

    HttpResponse::Ok()
        .content_type("text/html")
        .body(response_body)
}

#[get("/login")]
async fn render_login(user: Option<Identity>, tmpl: web::Data<Tera>) -> impl Responder {
    if user.is_some() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/"))
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
    user: Option<Identity>,
    payload: web::Form<LoginUser>,
    repository: web::Data<RepositoryForDb>,
) -> impl Responder {
    if user.is_some() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/app"))
            .finish();
    }

    let mut cookie_messages = generate_cookie_messages(&req);

    // Validation
    if let Err(validation_errors) = payload.validate() {
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

    let username = payload.username.clone();
    let result = repository.get(username).await;

    match result {
        Ok(logined_user) => {
            // 入力されたパスワードのハッシュ値を保存されているハッシュ値と比較
            let parsed_hash = PasswordHash::new(&logined_user.password).unwrap();
            let is_match =
                Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash);
            match is_match {
                Ok(_) => {
                    let _ = Identity::login(&req.extensions(), logined_user.username);

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
async fn render_signup(user: Option<Identity>, tmpl: web::Data<Tera>) -> impl Responder {
    if user.is_some() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/"))
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
    user: Option<Identity>,
    payload: web::Form<SignupUser>,
    repository: web::Data<RepositoryForDb>,
) -> impl Responder {
    if user.is_some() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/"))
            .finish();
    }

    let mut cookie_messages = generate_cookie_messages(&req);

    if let Err(validation_errors) = payload.validate() {
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

    let new_user = NewUser::new(payload);
    let result = repository.create(new_user).await;

    match result {
        Ok(signuped_user) => {
            Identity::login(&req.extensions(), signuped_user.username);

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
async fn logout(user: Option<Identity>) -> impl Responder {
    if user.is_none() {
        return HttpResponse::TemporaryRedirect()
            .insert_header(("location", "/login"))
            .finish();
    }

    user.unwrap().logout();
    return HttpResponse::Found()
        .append_header(("location", "/"))
        .finish();
}
