const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Farm = require('../models/Farm');
const { protect, isFarmer } = require('../middleware/authMiddleware');

// --- GET ALL REVIEWS FOR A FARMER'S PRODUCTS ---
// URL: GET /api/reviews/farm
// Access: Private (Farmers only)
router.get('/farm', protect, isFarmer, async (req, res) => {
    try {
        // 1. Find the farm owned by the logged-in farmer
        const farm = await Farm.findOne({ owner: req.user.id });
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found for this user.' });
        }

        // 2. Find all products belonging to that farm
        const products = await Product.find({ farm: farm._id });
        const productIds = products.map(p => p._id);

        // 3. Find all reviews for those products
        const reviews = await Review.find({ product: { $in: productIds } })
            .populate('customer', 'username') // Get the customer's username
            .populate('product', 'name')      // Get the product's name
            .sort({ createdAt: -1 });         // Show newest reviews first

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching reviews.' });
    }
});


// --- CREATE A NEW REVIEW FOR A PRODUCT ---
// URL: POST /api/reviews/:productId
// Access: Private (Any logged-in user)
router.post('/:productId', protect, async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    try {
        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({ product: productId, customer: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // Create and save the new review
        const review = new Review({
            rating,
            comment,
            product: productId,
            customer: req.user.id
        });

        await review.save();
        res.status(201).json({ message: 'Review added successfully!', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating review.' });
    }
});


module.exports = router;