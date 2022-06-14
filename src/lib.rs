#[macro_use]
extern crate diesel;

use actix_web::web::Data;
use chrono::{NaiveDate};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};

pub mod scopes;
mod users;
mod todos;
mod schema;
mod manage_cookie;

pub type Pool = Data<r2d2::Pool<ConnectionManager<MysqlConnection>>>;

// Option<String>の日付をOption<NaiveDate>に変換して返却
pub fn convert_to_date(date_str: &str) -> NaiveDate {
    let date_splited: Vec<&str> = date_str.split('-').collect();
    let [y, m, d] = [date_splited[0], date_splited[1], date_splited[2]];
    NaiveDate::from_ymd(
        y.parse::<i32>().unwrap(),
        m.parse::<u32>().unwrap(),
        d.parse::<u32>().unwrap()
    )
}