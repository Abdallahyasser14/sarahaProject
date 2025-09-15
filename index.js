import 'dotenv/config'; // MUST be first — runs before any other import 3shan law ay import uses env variables

import express from 'express';
import dbConnection from './src/DB/Models/db.connection.js';
import userRouter from './src/Modules/user/user.controller.js';
import messageRouter from './src/Modules/messages/messages.controller.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

const app = express();
// Connect to the database it will retry to connect if it fails until it time out
// if the database is not running it will throw an error after 30 seconds
dbConnection();

app.use(express.json());
app.use('/uploads',express.static('uploads')); // lama yegy upload  roh l upload folder  3shan ye3raf ya3ni eno msh router d2a static folder
const whiteList=process.env.WHITE_LISTED_ORIGINS;
app.use(cors({
    origin:(origin,callback)=>{
        console.log(origin);
        if(whiteList.includes(origin) || !origin){
            callback(null,true);
        }
        else{
            callback(new Error("Not allowed by CORS"));
        }
    }
}));
app.use("/users",userRouter);
app.use("/messages",messageRouter);

app.use(async (err,req,res,next)=>{          //!  error handling middleware this is an internal error handler middleware
    console.log(err);
    if(req.session && req.session.inTransaction()){
    await req.session.abortTransaction();
    req.session.endSession();}
    res.status(500).json({message:"Internal server error here",err });
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');});
