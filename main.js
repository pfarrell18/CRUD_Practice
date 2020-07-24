const pgp = require("pg-promise")();
const connect = {
    host: "localhost",
    port: 5432,
    user: "priyankafarrell",
    database: "todo_app"
}

const db = pgp(connect)

db.any('SELECT * FROM tasks')
.then(users=>console.log(users))