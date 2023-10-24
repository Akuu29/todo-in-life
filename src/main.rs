use actix_files::Files;
use actix_identity::IdentityMiddleware;
use actix_session::{storage::CookieSessionStore, SessionMiddleware};
use actix_web::cookie::Key;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;
use std::env;
use tera::Tera;
use todo_in_life::scopes::{main_scope, todos_scope};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 環境変数ロード
    dotenv().ok();

    // logging初期化
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();

    // DB接続プールの作成
    let database_url = env::var("DATABASE_URL").expect("Please set DATABASE_URL in .env");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Filed to create db pool");

    let secret_key = Key::generate();
    let host = env::var("HOST").expect("Please set HOST in .env");
    let port = env::var("PORT").expect("Please set PORT in .env");
    tracing::debug!("Listening on http://{}:{}", host, port);
    HttpServer::new(move || {
        App::new()
            .wrap(IdentityMiddleware::default())
            .wrap(SessionMiddleware::new(
                CookieSessionStore::default(),
                secret_key.clone(),
            ))
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(Tera::new("templates/**/*").unwrap()))
            .service(Files::new("/client", "./client"))
            .service(todos_scope::get_scope())
            .service(main_scope::get_scope())
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}
