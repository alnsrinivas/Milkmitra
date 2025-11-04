const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'A rating is required.'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;