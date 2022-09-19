// @generated automatically by Diesel CLI.

diesel::table! {
    todos (id) {
        id -> Uuid,
        title -> Varchar,
        content -> Nullable<Varchar>,
        category -> Varchar,
        date_limit -> Nullable<Date>,
        date_created -> Timestamp,
        user_id -> Uuid,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        username -> Varchar,
        email -> Varchar,
        password -> Varchar,
        data_created -> Timestamp,
    }
}

diesel::joinable!(todos -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    todos,
    users,
);
