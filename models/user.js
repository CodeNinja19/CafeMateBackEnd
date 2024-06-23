const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
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
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    cafe:[{type:mongoose.Schema.Types.ObjectId,ref:'AllCafe'}],
});

cafeSchema.pre("save",async function (next){
    const salt = bcrypt.genSaltSync(saltRounds);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

cafeSchema.statics.login=async function (username,password){
    const user=await this.findOne({username});
    console.log(user);
    if (!user) return false;
    const result=bcrypt.compareSync(password, user.password);
    if (result) return user;
    else return false;
};
const User=mongoose.model("User",cafeSchema);
module.exports=User;