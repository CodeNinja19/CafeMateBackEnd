const {Router}=require("express");
const app=Router();
const AppError=require("../Utilities/AppError.js");
const jwt=require("jsonwebtoken");
const User=require("../models/user.js");
require('dotenv').config();

const saltRounds=parseInt(process.env.saltRounds);
const jwtTokenSecret=process.env.jwtTokenSecret;
const maxAge=24*60*60;
const verifyToken=function (token){
    let status=false;
    jwt.verify(token,jwtTokenSecret,function (err,decodedToken){
        if(!err) status=true;
    })
    return status;
}

const createToken=function (id){
    return jwt.sign({id},jwtTokenSecret,{
        expiresIn:maxAge
    });
};

app.get("/logout",function (req,res,next){
    res.cookie("jwt",' ',{maxAge:1});
    res.json({success:true});
})

app.get("/isLoggedIn",function (req,res,next){
    const token=req.cookies.jwt;
    let status=false;
    if (token){
        status=verifyToken(token);
    }
    res.json({status}); 
    
})


app.post("/login",async (req,res,next)=>{
    const {username,password}=req.body;
    if (!username || !password) {
        return next(new AppError(500,"Invalid Password or Username!!"));
    }
    try{
        const result=await User.login(username,password);
        // console.log(result);
        if (!result) return next(new AppError(401,"Invalid Password or Username"));
        res.cookie("jwt",createToken(result._id),{httpOnly:true,maxAge:maxAge*1000});
        res.json({username:result.username});
    }
    catch(err){
        next(err);
    }
    
})

app.post("/SignUp",async (req,res,next)=>{
    const {username,password}=req.body;
    if (!username || !password) {
        return next(new AppError(500,"Invalid Password or Username!!"));
    }
    try{
        const data=User({username,password});
        await data.save();
        res.json({username});
    }
    catch(err){
        console.log(err);
        next(new AppError(500,"Something went Wrong while saving may be validations!!"));
    }
})

module.exports=app;