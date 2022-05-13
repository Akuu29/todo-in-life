use actix_web::{get, web, Scope, Responder, HttpResponse};
use actix_web::web::{Data};
use tera::{Tera, Context};

pub fn get_scope() -> Scope {
    web::scope("")
        .service(index)
}

#[get("/")]
async fn index(tmpl: Data<Tera>) -> impl Responder {
    let response_body = tmpl
        .render("index.html", &Context::new())
        .unwrap();
    
    HttpResponse::Ok().content_type("text/html").body(response_body)
}