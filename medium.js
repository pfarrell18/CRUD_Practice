const express = require ('express')
const app = express()
const pgp = require("pg-promise")();
const connect = {
    host: "localhost",
    port: 5432,
    user: "priyankafarrell",
    database: "todo_app"
}

const db = pgp(connect)
app.use(express.urlencoded({ extended: true }));

//homepage
app.get('/', (req, res) => res.send("Welcome to task manager!"))

//allows you to create tasks (linked to separate html)
app.get('/createtask', (req, res, next) => res.sendFile(`${__dirname}/createtask.html`));

//allows you to create a task using input from buttons!
app.post('/createtask', (req, res, next)=> {
    let newtask = req.body.title
    let is_done = req.body.task
    db.none('insert into tasks (title, is_completed) VALUES ($1, $2)', [newtask, is_done])
    .then(results => res.send("Your task was created!"))
})

//prints out all existing tasks
app.get('/readtasks', (req, res)=>{
    db.any('select * from tasks')
    .then(results => res.send(results))
})

//creates a page for each item in tasks..
db.any('SELECT * FROM tasks')
.then(users=>{
    for (var i=0; i<users.length; i++){
        const task = users[i].title
        const id = users[i].id
        console.log(task)
        app.get(`/${users[i].id}`, (req, res) => res.send(`<html>
        <body>
            <h2>${task}</h2>
        </body>
        </html>`))
    }
})

//this updates the tasks but does not use "patch"
app.get('/updatetask/:id', (req, res)=> {
    const taskId = req.params.id
    db.none("UPDATE tasks SET is_completed = $1 WHERE id = $2", [true, taskId])
    .then(results => res.send("Your task was updated!"))
})

//this deletes the tasks but does not use app. delete
app.get('/deletetask/:id', (req, res)=> {
    const taskId = req.params.id
    db.none('DELETE FROM tasks WHERE id = $1', [taskId])
    .then(results => res.send("Your task was deleted!"))
    .then(results => app.delete(`/${taskId}`))
})

// app.patch('/edit-task/:id', async (req,res)=>{
//     let result = await db.one(`UPDATE tasks  SET is_completed = 'true' WHERE id='${req.params.id}' RETURNING *`);
//     res.send(result);
// })


// app.delete('/delete-task/:id', async (req,res)=>{
//     let result = await db.one(`DELETE FROM tasks WHERE id='${req.params.id}' RETURNING *`)
//     res.send(result)
// })

app.listen (3500)