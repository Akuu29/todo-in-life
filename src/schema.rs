// @generated automatically by Diesel CLI.

diesel::table! {
    todos (id) {
        id -> Uuid,
        #[max_length = 150]
        title -> Varchar,
        #[max_length = 900]
        content -> Nullable<Varchar>,
        #[max_length = 18]
        category -> Varchar,
        date_limit -> Nullable<Date>,
        date_created -> Timestamp,
        user_id -> Uuid,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        #[max_length = 32]
        username -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        data_created -> Timestamp,
    }
}

diesel::joinable!(todos -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(todos, users,);
