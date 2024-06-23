const mongoose =require("mongoose");

const cafeSchema=mongoose.Schema({

    cafeName:{
        type:String,
        required:true
    },
    rating:{
        type:mongoose.Decimal128,
    },
    avgPrice:{
        type:Number,
        required:true,
    },
    northIndian:{
        type:Boolean,
        required:true,
    },
    southIndian:{
        type:Boolean,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    filename: { 
        type: String, 
        required: true,
    },
    cafeImage: {
         type: String,
          required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

const AllCafe=mongoose.model("AllCafe",cafeSchema);
module.exports=AllCafe;

// restaurant_name: '# Momo',
// rating: Decimal128('4.2'),
// average_price: 200,
// 'average _delivery_time': 34,
// south_indian_or_not: 0,
// north_indian_or_not: 0,
// fast_food_or_not: 0,
// street_food: 0,
// biryani_or_not: 0,
// bakery_or_not: 0,
// location: 'Durgapur'