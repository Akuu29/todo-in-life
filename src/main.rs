use std::env;
use actix_web::{App, HttpServer};
use actix_web::web::Data;
use actix_web::middleware::Logger;
use actix_files::Files;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use tera::Tera;
use rand::Rng;
use dotenv::dotenv;
use listenfd::ListenFd;
use todo_in_life::scopes::{main_scope, todos_scope};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // .envから環境変数ロード
    dotenv().ok();

    // DB接続プールの作成
    let database_url = env::var("DATABASE_URL")
        .expect("Please set DATABASE_URL in .env");
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    let pool = r2d2::Pool::builder().build(manager).expect("Filed to create db pool");

    let mut listenfd = ListenFd::from_env();

    // CookieIdentityPolicyに使う秘密鍵の指定
    // private_keyが変更された場合全てのCookieに保存されたIDは無効になる
    let private_key = rand::thread_rng().gen::<[u8; 32]>();

    let mut server = HttpServer::new(move || {
        // CookiIdentityPolicyの生成
        // CookieをIDの保存場所として使う
        let policy = CookieIdentityPolicy::new(&private_key)
            .name("auth-cookie")
            .http_only(true)
            .secure(false);

        App::new()
            .wrap(IdentityService::new(policy))
            .wrap(Logger::default())
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(Tera::new("templates/**/*").unwrap()))
            .service(Files::new("/client", "./client"))
            .service(todos_scope::get_scope())
            .service(main_scope::get_scope())
    });

    // loggerを初期化
    env_logger::init();

    // systemfdによってwatchしていた場合、そのhostとportを使用
    server = if let Some(listener) = listenfd.take_tcp_listener(0)? {
        server.listen(listener)?
    } else {
        // .envから読み込んだ環境変数を使用
        let host = env::var("HOST").expect("Please set HOST in .env");
        let port = env::var("PORT").expect("Please set PORT in .env");
        server.bind(format!("{}:{}", host, port))?
    };

    server.run().await
}
