const express=require("express");
const path=require("path");
const app=express();
const cors=require("cors");
const mongoose = require('mongoose');
const AppError=require("./Utilities/AppError.js");
const cookieParser=require("cookie-parser");
const login=require("./routes/login.js");
const fetchData=require("./routes/fetchData.js")
const AllCafe=require("./models/AllCafe.js");



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cafes');
}


const testing=async function (){
    const data=await AllCafe.findOne({cafeName:"# Momo"});
    console.log(data);
}
// testing();
// app.use section

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());



app.get("/api",(req,res)=>{
    res.status(200).json({message:"welcome back it has been a long time!!!"});
})


app.use("/api",login);
app.use("/api",fetchData);

app.use((err,req,res,next)=>{
    const {status,message}=err;
    console.log(err);
    res.json({message});

})
app.listen("4000",()=>{
    console.log("All good");
})