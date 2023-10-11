const mongoose=require("mongoose");
const url ="mongodb+srv://govindgirigoswami1501:Govind1501@cluster0.bzdnedh.mongodb.net/my_db";

const conn=async()=>{
    await mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("mongodb connected");
}).catch((error)=>{
    console.log("db connection failed",error);
})
}
module.exports=conn;
