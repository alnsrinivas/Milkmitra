const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product'); // We need this to find the farm
const Farm = require('../models/Farm');
const sendEmail = require('../utils/email');
const { protect } = require('../middleware/authMiddleware');


// @desc    Process a payment and create an order
// @route   POST /api/payments/process
// @access  Private
// In routes/paymentRoutes.js

// --- REPLACE THE ENTIRE ROUTE WITH THIS ---

router.post('/process', protect, async (req, res) => {
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in the cart' });
    }

    try {
        // This object will group items by their farm ID.
        const farmOrders = {};

        // 1. Fetch details for all products at once and group them by farm.
        for (const item of items) {
            const productDetails = await Product.findById(item.product);
            if (!productDetails) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
            }
            
            const farmId = productDetails.farm.toString();

            // If this is the first item from this farm, initialize its order object.
            if (!farmOrders[farmId]) {
                farmOrders[farmId] = {
                    items: [],
                    farm: farmId,
                    totalAmount: 0
                };
            }

            // Add the item and its cost to the correct farm's order.
            farmOrders[farmId].items.push({ product: item.product, quantity: item.quantity });
            farmOrders[farmId].totalAmount += productDetails.price * item.quantity;
        }

        // 2. Create a separate order for each farm.
        const createdOrders = [];
        for (const farmId in farmOrders) {
            const orderData = farmOrders[farmId];
            const newOrder = new Order({
                customer: req.user.id,
                farm: orderData.farm,
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                deliveryAddress: deliveryAddress,
                status: 'pending'
            });
            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
            // --- ADD THIS EMAIL NOTIFICATION LOGIC ---
            try {
                const farm = await Farm.findById(farmId).populate('owner', 'email');
                if (farm && farm.owner && farm.owner.email) {
                    const message = `You have received a new order!\n\nOrder ID: ${savedOrder._id}\nTotal Amount: ₹${savedOrder.totalAmount.toFixed(2)}\nPlease log in to your dashboard to confirm and process the order.`;
                    await sendEmail({
                        email: farm.owner.email,
                        subject: '🎉 You Have a New Order! - MilkMitra',
                        message
                    });
                }
            } catch (emailError) {
                console.error('Failed to send new order notification email:', emailError);
                // Do not block the order process if email fails
            }
            // --- END OF NOTIFICATION LOGIC ---
        }

        res.status(201).json({
            message: 'Payment successful and orders created!',
            orders: createdOrders
        });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Server error while processing payment.' });
    }
});

module.exports = router;
