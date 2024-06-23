const {Router}=require("express");
const app=Router();
const AllCafe=require("../models/AllCafe")
const jwt=require("jsonwebtoken");
const AppError=require("../Utilities/AppError.js");


function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new AppError(401, "Unauthorized request"));
    }

    jwt.verify(token, jwtTokenSecret, function (err, decodedToken) {
        if (err) {
            return next(new AppError(401, "Invalid token"));
        }
        req.user = decodedToken; // Add the decoded token to the request object
        next();
    });
}


app.post("/getCafes",async function (req,res,next){
    const {category,number}=req.body;
    try{
        const data=await AllCafe.find().sort({[category]:-1}).limit(number);
        res.json({cafes:data});
    } catch(err){
        res.send("send a valid category!!");
    }

})


app.use(verifyToken);

app.post("/image",async function (req,res,next){
    const data=await AllCafe.findOne({cafeName:"# Momo"});
    res.json({cafeImage:data.cafeImage});
});



module.exports=app;
