const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: { 
        type: String, required: true 
    },
    title: {
        type: String, required: true
    },
    rating: { 
        type: Number, required: true 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cafe:{type:mongoose.Schema.Types.ObjectId,ref:'AllCafe'},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;