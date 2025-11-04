const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { protect, isFarmer } = require('../middleware/authMiddleware');

// --- FARM REGISTRATION ---
router.post('/', protect, async (req, res) => {
    try {
        const { farmName, address } = req.body;
        const existingFarm = await Farm.findOne({ owner: req.user.id });
        if (existingFarm) {
            return res.status(400).json({ message: 'This user already owns a registered farm.' });
        }
        const newFarm = new Farm({ farmName, address, owner: req.user.id });
        await newFarm.save();
        res.status(201).json({ message: 'Farm registered successfully!', farm: newFarm });
    } catch (error) {
        console.error("Error in farm registration route:", error.message);
        res.status(500).json({ message: 'Server Error during farm registration.' });
    }
});

// --- GET FARM DASHBOARD STATISTICS --- (NEW ROUTE)
// URL: GET /api/farms/stats
// Access: Private (Farmers only)
router.get('/stats', protect, isFarmer, async (req, res) => {
    try {
        // 1. Find the farmer's farm
        const farm = await Farm.findOne({ owner: req.user.id });
        if (!farm) {
            return res.status(404).json({ message: "Farm not found." });
        }
        const farmProducts = await Product.find({ farm: farm._id }).select('_id');
        const productIds = farmProducts.map(p => p._id);

        // 2. Calculate Today's Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysOrders = await Order.find({
            'items.product': { $in: productIds },
            createdAt: { $gte: today }
        });

        const todaysRevenue = todaysOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // 3. Calculate Average Rating
        const reviews = await Review.find({ product: { $in: productIds } });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
        
        // 4. Get Active Customers (unique customers who have ordered)
        const allOrders = await Order.find({'items.product': { $in: productIds }}).distinct('customer');
        const activeCustomers = allOrders.length;


        res.json({
            ordersToday: todaysOrders.length,
            revenueToday: todaysRevenue,
            averageRating: parseFloat(averageRating),
            activeCustomers
        });

    } catch (error) {
        console.error("Error fetching farm stats:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
