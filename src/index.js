const express = require("express")
const app = express();
const task = require("./models/task")
require('./db/mongoose')
const User = require('./models/user') 
const bcrypt = require('bcryptjs');
const port = process.env.port|| 3000;
const user_router = require("./Routers/User")
const task_router = require("./Routers/Task")



app.use(express.json());
app.use(user_router);
app.use(task_router);

app.listen(port, ()=>{

    console.log("Port is running on port :- "+port);
})


