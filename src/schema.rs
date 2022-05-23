table! {
    todos (id) {
        id -> Char,
        title -> Varchar,
        content -> Nullable<Varchar>,
        category -> Varchar,
        date_limit -> Nullable<Date>,
        status -> Bool,
        date_created -> Timestamp,
        user_id -> Char,
    }
}

table! {
    users (id) {
        id -> Char,
        username -> Varchar,
        email -> Varchar,
        password -> Varchar,
        date_created -> Timestamp,
    }
}

allow_tables_to_appear_in_same_query!(
    todos,
    users,
);
