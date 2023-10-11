// reqiure basic node modules
const express=require('express');
const mongoose=('mongoose');
const cors=require('cors');
const conn=require("./connection/mongodb_conn")
// connect data base
conn();
// cross origin resourse sharing from diffrent domain middleware (cors) 
const app=express();
app.use(cors());
app.use(express.json());


// https request from front end

 app.use("/news",require("./routes/api_route.js"));


// server connection

app.listen(8000,()=>{
    console.log("server listen at 8000");
})



