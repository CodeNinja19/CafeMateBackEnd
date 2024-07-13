const {Router}=require("express");
const app=Router();
const AllCafe=require("../models/AllCafe")
const jwt=require("jsonwebtoken");
const User=require("../models/user.js");
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

app.get("/getCurrentUser",async function(req,res,next){
    try{
        const user=await User.findById(req._id);
        res.json(JSON.stringify(user));
    } catch(err){
        next(new AppError(500,"Can't get this users try logout and login"));
    }  
});

app.post("/updateData",async function(req,res,next){
    const data=req.body;
    const result=await User.findByIdAndUpdate(req._id,data,{returnDocument:'after'});
    console.log(result);
    res.json(JSON.stringify(result));
})

app.get("/searchCafes",async function (req,res,next){
    const { searchName, page, limit } = req.query;
    console.log(req.query);

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    try {
        // Search and paginate components
        const cafes = await AllCafe.find({
            cafeName: {$regex: searchName, $options: "i"} // case-insensitive search
        })
        .skip(skip)
        .limit(limitNum);

        // Get total number of matched components
        const total = await AllCafe.countDocuments({
            cafeName: {$regex: searchName, $options: "i"},
        });
        console.log(total);
        res.json({
            cafes,
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.get("/getCafe",async function (req,res,next){
    const {cafe_id}=req.query;
    if (!cafe_id) next(new AppError(404,"Provide an id for the cafe!!!"));

    try{
        const currCafe=await AllCafe.findById(cafe_id).populate("reviews");
        if (!currCafe) next(new AppError(404,"No such Cafe Exists!!!"));
        else {
            
            res.json(JSON.stringify({resCafe:currCafe._doc}));
        }
    } catch(err){
        console.log(err);
        next(new AppError(500,"Database is not responding!!!"));
    }
    
});

module.exports=app;
