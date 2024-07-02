const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const fs = require('fs');
const path=require("path");
const saltRounds=12;

const cafeSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:7
    },
    age:{
        type:Number,
    },
    address:{
        type:String,
    },
    gender:{
        type:String,
    },
    profileImage:{
        type:String,
    },
    chat:{
        type:Object,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    cafe:[{type:mongoose.Schema.Types.ObjectId,ref:'AllCafe'}],
});

cafeSchema.pre("save",async function (next){
    const salt = bcrypt.genSaltSync(saltRounds);
    this.password = bcrypt.hashSync(this.password, salt);
    this.age=18;
    this.address="default";
    this.gender="Not Choosen";
    const data=await fs.readFileSync(path.join(__dirname,'../imagesCafes/defaultProfilePic.jpg'));
    this.profileImage=data.toString('base64');
    this.chat={
        contents: [
            {
                parts: [
                    {
                        text: "Welcome to the official website of Cafe Mate"
                    }
                ],
                role: "model"
            },
        ]
    }
    next();    
})

cafeSchema.statics.login=async function (username,password){
    const user=await this.findOne({username});
    // console.log(user);
    if (!user) return false;
    const result=bcrypt.compareSync(password, user.password);
    if (result) return user;
    else return false;
};

const User=mongoose.model("User",cafeSchema);
module.exports=User;