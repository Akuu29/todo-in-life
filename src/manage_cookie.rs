use actix_web::{HttpRequest};
use actix_web::cookie::Cookie;


pub fn generate_cookie_messages(req: &HttpRequest) -> Cookie {
    // cookieにmessagesが存在しない場合、新たに生成
    // 存在した場合、初期化
    req.cookie("messages").map_or(
        Cookie::build("messages", "[]")
            .http_only(false)
            .finish(),
        |mut messages| {
            messages.set_value("[]");
            messages
        },
    )
}

