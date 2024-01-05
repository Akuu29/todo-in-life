# todo-in-life
This is todo application.  
This application has the ability to get, create, update and delete todo's.  
You can also manage todo's by grouping them into **"short"**, **"medium"**, **"long"**, and **"complete"** categories.

![スクリーンショット 2022-06-22 6 27 24](https://user-images.githubusercontent.com/57586401/174900240-22b46732-b2e7-438c-8dbe-40fe0dee0c3a.png)
![スクリーンショット 2022-06-21 7 37 05](https://user-images.githubusercontent.com/57586401/174899833-b5ea4c1e-ce03-44ef-9d22-147e5276785a.png)
![スクリーンショット 2022-06-21 7 37 20](https://user-images.githubusercontent.com/57586401/174899888-950470f0-3eb2-463b-bb47-177fa3d0bfa0.png)
![スクリーンショット 2022-06-22 6 30 33](https://user-images.githubusercontent.com/57586401/174900636-abe8b1b6-0696-492a-8c4e-81fe36dd3608.png)
![スクリーンショット 2022-06-22 6 29 07](https://user-images.githubusercontent.com/57586401/174900444-68bc8a2a-b75f-4d99-b297-90cadd833329.png)
[![Image from Gyazo](https://i.gyazo.com/9f84235a54805f38add76456ec6f66d1.gif)](https://gyazo.com/9f84235a54805f38add76456ec6f66d1)

## The following technologies are used:
### Client
* React
### Database
* [sqlx](https://github.com/launchbadge/sqlx "sqlx"), SQL Toolkit for Rust
### Server
* [actix-web](https://actix.rs/ "actix-web"), Web Framework for Rust

## Setup
### Client
***Execute the following command in the project ./client.***
```bash
# Install the dependencies for React
npm install
# Bundle the JavaScript
npm run build
```

### Backend
#### Environment variables
***Execute the following command in the project root.***
```bash
echo HOST=0.0.0.0 >> .env
echo PORT=8000 >> .env
echo DATABASE_URL=postgres://admin:admin@localhost:5432/todo-in-life >> .env
```
#### Docker
***Execute the following command in the project root.***
```bash
# Build the docker container
docker compose up -d
# Enter the docker container
docker exec -it todo-in-life-actix-backend-1 bash
```
#### Database
***Execute the following command in the docker container root.***
```bash
# Create the database
sqlx db create
# Create the schema
sqlx migrate run
```
#### Server
***Execute the following command in the docker container root.***
```bash
# Start the server
cargo run
```
If the server starts successfully, visit [localhost](localhost:8000/).
