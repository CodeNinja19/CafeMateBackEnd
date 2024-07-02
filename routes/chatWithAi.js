const {Router}=require("express");
const app=Router();
const jwt=require("jsonwebtoken")
const User=require("../models/user.js")
const AskQuestion=require("../gemini/AskQuestion.js");
const AppError = require("../Utilities/AppError");

require('dotenv').config();

const jwtTokenSecret=process.env.jwtTokenSecret;



function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new AppError(401, "Unauthorized request"));
    }

    jwt.verify(token, jwtTokenSecret, function (err, decodedToken) {
        if (err) {
            return next(new AppError(401, "Invalid token"));
        }
        req._id = decodedToken.id; // Add the decoded token to the request object
        next();
    });
}

app.use(verifyToken);

app.post("/chatWithAi",async function(req,res,next){
    const {txt}=req.body;
    const newEntry={
        parts:[
        {
            text:txt
        },
    ],
     role:"user",
    }
    const result=await User.findById(req._id);
    result.chat.contents.push(newEntry);
    try{
        let request = await AskQuestion.generateContent(result.chat);
        const data=request.response.text();
        console.log(data);
        const reply={
            parts:[
                {
                    text:JSON.parse(data).answer,
                }
            ],
            role:"model"
        }
        result.chat.contents.push(reply);
        const ans=await User.findByIdAndUpdate(req._id,result,{returnDocument:'after'});
        res.json(JSON.stringify(ans));

    } catch(err){
        console.log(err);
        next(new AppError(500,"Gemini is down!!"));
    }
})


module.exports=app;