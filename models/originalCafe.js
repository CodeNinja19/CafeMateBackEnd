const mongoose =require("mongoose");

const cafeSchema=mongoose.Schema({

    restaurant_name:{
        type:String,
        required:true
    },
    rating:{
        type:mongoose.Decimal128,
    },
    average_price:{
        type:Number,
        required:true,
    },
    average_delivery_time:{
        type:Number,
    },
    south_indian_or_not:{
        type:Number,
        required:true,
    },
    north_indian_or_not:{
        type:Number,
        required:true,
    },
    fast_food_or_not:{
        type:Number,
        required:true,
    },
    street_food:{
        type:Number,
    },
    biryani_or_not:{
        type:Number,
    },
    bakery_or_not:{
        type:Number,
    },
    location:{
        type:String,
        required:true,
    },

});

const Cafe=mongoose.model("cafe",cafeSchema);

module.exports=Cafe;


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