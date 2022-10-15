# todo-in-life

![スクリーンショット 2022-06-22 6 27 24](https://user-images.githubusercontent.com/57586401/174900240-22b46732-b2e7-438c-8dbe-40fe0dee0c3a.png)
![スクリーンショット 2022-06-21 7 37 05](https://user-images.githubusercontent.com/57586401/174899833-b5ea4c1e-ce03-44ef-9d22-147e5276785a.png)
![スクリーンショット 2022-06-21 7 37 20](https://user-images.githubusercontent.com/57586401/174899888-950470f0-3eb2-463b-bb47-177fa3d0bfa0.png)
![スクリーンショット 2022-06-22 6 30 33](https://user-images.githubusercontent.com/57586401/174900636-abe8b1b6-0696-492a-8c4e-81fe36dd3608.png)
![スクリーンショット 2022-06-22 6 29 07](https://user-images.githubusercontent.com/57586401/174900444-68bc8a2a-b75f-4d99-b297-90cadd833329.png)
[![Image from Gyazo](https://i.gyazo.com/9f84235a54805f38add76456ec6f66d1.gif)](https://gyazo.com/9f84235a54805f38add76456ec6f66d1)

This is todo application.
This application has the ability to get, create, update and delete todo's. 
You can also manage todo's by grouping them into 'short', 'medium', 'long', and 'complete' categories.

### The following technologies are used:
#### Client
* React
#### Database
* [Diesel](https://diesel.rs/ "diesel") ORM with Postgresql as default DB
#### Server
* [actix-web](https://actix.rs/ "actix-web"), web framework for Rust


### Setup
#### Client
Execute the following command in the project ./client.
```powershell
# Install the dependencies for React
npm install
# Bundle the JavaScript
npm run prod
```
#### Database
Execute the following command in the project root.
```powershell
# Install the 'diesel_cli' (If you have not installed this yet)
cargo install diesel_cli --no-default--features --features postgres
# Set the 'DATABASE_URL' enviroment variable. Check the notes for more information.
echo DATABASE_URL=postgres://{USERNAME}:{PASSWORD}@{HOST}/todo_in_life >> .env
# Create the datebase
diesel setup
# Create the schema
diesel migration run
```

>Regarding 'DATABASE_URL' enviroment variable
>
>Replace '{USERNAME}', '{PASSWORD}', '{HOST}' and '{PORT}' in 'DATABASE_URL' with the fllowing.  
>{USERNAME} -> user's username  
>{PASSWORD} -> user's password  
>{HOST} -> user's host  

#### Server
Execute the following command in the project root.  
(If the Client and Database settings have not been completed, priority should be given those setups.)
```powershell
# Install the 'systemfd' (If you have not installed this yet)
cargo install systemfd
# Set the 'RUST_LOG' enviroment variable.
echo RUST_LOG=rest_api=info,actix=info >> .env
# Set the 'HOST' and 'PORT' enviroment variable.
echo HOST=127.0.0.1 >> .env
echo PORT=3000 >> .env
# Compile the server
cargo build --release
# Run the server
cargo run --release
```
If the server starts successfully, visit http://127.0.0.1:3000/.
