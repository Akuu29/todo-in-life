#[macro_use]
extern crate diesel;

use std::env;
use actix_web::{App, HttpServer};
use actix_web::web::Data;
use actix_web::middleware::Logger;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use tera::Tera;
use dotenv::dotenv;
use listenfd::ListenFd;
use scopes::get_scope;

mod scopes;
mod users;
mod schema;

pub type Pool = Data<r2d2::Pool<ConnectionManager<MysqlConnection>>>;

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
    let mut server = HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(Tera::new("templates/**/*").unwrap()))
            .service(get_scope())
            .wrap(Logger::default())
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
