// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Farm = require('../models/Farm');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Issue = require('../models/Issue');
const sendEmail = require('../utils/email');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Protect all routes in this file with the isAdmin middleware
router.use(protect, isAdmin);

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
    const users = await User.countDocuments();
    const farms = await Farm.countDocuments();
    const orders = await Order.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'Open' });
    res.json({ users, farms, orders, openIssues });
});

// --- USER MANAGEMENT ---
router.get('/users', async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
});

// --- ISSUE MANAGEMENT ---
router.get('/issues', async (req, res) => {
    const issues = await Issue.find({}).populate('user', 'username email');
    res.json(issues);
});

router.patch('/issues/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        // Find the issue and get the user's details at the same time
        const issue = await Issue.findById(req.params.id).populate('user', 'email username');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.status = status;
        await issue.save();

        // --- ADD THIS EMAIL NOTIFICATION LOGIC ---
        // If the new status is 'Resolved', send an email to the user
        if (status === 'Resolved' && issue.user && issue.user.email) {
            try {
                const subject = `✅ Your Support Ticket Has Been Resolved: "${issue.subject}"`;
                const message = `Hello ${issue.user.username},\n\nGood news! Your support ticket regarding "${issue.subject}" has been marked as resolved by our team.\n\nIf you feel the issue is not fully addressed, please feel free to submit a new ticket. Thank you for using MilkMitra!`;

                await sendEmail({
                    email: issue.user.email,
                    subject: subject,
                    message: message
                });
            } catch (emailError) {
                console.error('Failed to send issue resolved notification email:', emailError);
                // We don't want to fail the request if the email fails, so we just log the error.
            }
        }
        // --- END OF NOTIFICATION LOGIC ---

        res.json(issue);
    } catch (error) {
        console.error('Error updating issue status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// --- PRODUCT MANAGEMENT (ADMIN) ---

// @desc    Get all products from all farms
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('farm', 'farmName') // Get the farm's name
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Delete a product by its ID
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed successfully.' });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;