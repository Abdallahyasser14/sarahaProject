import express from 'express';
import dbConnection from './src/DB/Models/db.connection.js';
import userRouter from './src/Modules/user/user.controller.js';
import messageRouter from './src/Modules/messages/messages.controller.js';

const app = express();
// Connect to the database it will retry to connect if it fails until it time out
// if the database is not running it will throw an error after 30 seconds
dbConnection();

app.use(express.json());
app.use("/users",userRouter);
app.use("/messages",messageRouter);
app.listen(3000, () => {
    console.log('Server is running on port 3000');});


