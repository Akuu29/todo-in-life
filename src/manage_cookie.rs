use actix_web::{HttpRequest};
use actix_web::cookie::Cookie;
use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize)]
struct Message {
    title: String,
    content: String,
}

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

pub fn set_messages_in_cookie(
    cookie_messages: &mut Cookie,
    message_title: String,
    message_content: String
) {
    let mut messages = 
        serde_json::from_str::<Vec<Message>>(cookie_messages.value()).unwrap();
    let message = Message {
        title: message_title,
        content: message_content
    };
    messages.push(message);

    // messagesを文字列にしてcookieにセット
    cookie_messages.set_value(serde_json::to_string(&messages).unwrap());
}