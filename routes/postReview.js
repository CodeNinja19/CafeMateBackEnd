const {Router}=require("express");
const app=Router();
const AllCafe=require("../models/AllCafe")
const jwt=require("jsonwebtoken");
const User=require("../models/user.js");
const Review=require("../models/Review.js")
const AppError=require("../Utilities/AppError.js");

require('dotenv').config();

const saltRounds=parseInt(process.env.saltRounds);
const jwtTokenSecret=process.env.jwtTokenSecret;
const maxAge=24*60*60;

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

app.post("/postReview",async function (req,res,next){

    try{
        const {user_id=null,cafe_id=null,title=null,description=null,rating=null}=req.body;
        if (!user_id||!cafe_id||!title||!description||!rating){
            next(new AppError(500,"Please send all the details while requesting!!!"));
        } else {
            const currUser=await User.findById(user_id);
            const currCafe=await AllCafe.findById(cafe_id);
            const newReview=Review({content:description,title,rating,user:user_id,cafe:cafe_id});
            const currReview=await newReview.save();
            currUser.reviews.push(currReview);
            currCafe.reviews.push(currReview);
            const updatedUser=await User.findByIdAndUpdate(user_id,currUser,{returnDocument:'after'});
            const updatedCafe=await AllCafe.findByIdAndUpdate(cafe_id,currCafe,{returnDocument:'after'});
            const updateCafe=await updatedCafe.populate("reviews");
            console.log(updateCafe);
            res.json(JSON.stringify({...updateCafe._doc}));

        }
    } catch(err){
        console.log(err);
        next(new AppError(500,"something in the review route broke"));
    }

});

module.exports=app;