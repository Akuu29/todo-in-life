use std::env;
use actix_web::{App, HttpServer};
use actix_web::web::Data;
use actix_web::middleware::Logger;
use tera::Tera;
use dotenv::dotenv;
use listenfd::ListenFd;
use scopes::get_scope;

mod scopes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // .envから環境変数ロード
    dotenv().ok();

    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(move || {
        App::new()
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
        let host = env::var("HOST").expect("Please set host in .env");
        let port = env::var("PORT").expect("Please set host in .env");
        server.bind(format!("{}:{}", host, port))?
    };

    server.run().await
}
