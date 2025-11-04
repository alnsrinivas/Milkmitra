const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendEmail = require("../utils/email");
const { protect, isFarmer } = require("../middleware/authMiddleware");

// @desc    Get all orders for the logged-in customer
// @route   GET /api/orders/myorders
// @access  Private
router.get("/myorders", protect, async (req, res) => {
  try {
    // --- LOGICAL FIX HERE ---
    // We need to .populate() the 'items.product' field to get product details like the name.
    const orders = await Order.find({ customer: req.user.id })
      .populate("farm", "farmName") // Also get the farm's name
      .populate("items.product", "name price") // Get product name and price
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all orders for a farmer's farm
// @route   GET /api/orders/farm
// @access  Private/Farmer
router.get("/farm", protect, isFarmer, async (req, res) => {
  try {
    const farm = await require("../models/Farm").findOne({
      owner: req.user.id,
    });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found for this user." });
    }
    const orders = await Order.find({ farm: farm._id })
      .populate("customer", "username phone")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching farm orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get a single order by ID for tracking
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // --- Authorization check ---
    const isCustomer = order.customer.toString() === req.user.id;
    let isFarmerOwner = false;
    if (req.user.role === "farmer") {
      // We need the Farm model here
      const Farm = require("../models/Farm");
      const farm = await Farm.findOne({ owner: req.user.id });
      if (farm && order.farm.toString() === farm._id.toString()) {
        isFarmerOwner = true;
      }
    }

    if (!isCustomer && !isFarmerOwner) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not authorized to view this order.",
        });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching single order:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Farmer
// In routes/orderRoutes.js, REPLACE the entire status update route

router.patch("/:id/status", protect, isFarmer, async (req, res) => {
  try {
    // THE FIX IS ON THIS LINE: We now .populate() the customer's details
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "username email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Authorization Check: ensure the order belongs to this farmer's farm
    const Farm = require("../models/Farm");
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm || order.farm.toString() !== farm._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order." });
    }

    order.status = req.body.status;
    await order.save();

    // --- EMAIL NOTIFICATION LOGIC (Now works correctly) ---
    try {
      let emailSubject = "";
      let emailMessage = "";

      if (order.status === "confirmed") {
        emailSubject = `✅ Your MilkMitra Order #${order._id
          .toString()
          .substring(0, 8)} is Confirmed!`;
        emailMessage = `Hello ${order.customer.username},\n\nGreat news! Your order has been confirmed by the farm and is now being processed. You can track its status from your dashboard.`;
      } else if (order.status === "delivered") {
        emailSubject = `🚚 Your MilkMitra Order #${order._id
          .toString()
          .substring(0, 8)} Has Been Delivered!`;
        emailMessage = `Hello ${order.customer.username},\n\nYour fresh dairy products have been delivered. We hope you enjoy them! You can leave a review for the products from your "My Orders" page.`;
      }

      if (emailSubject && order.customer && order.customer.email) {
        await sendEmail({
          email: order.customer.email,
          subject: emailSubject,
          message: emailMessage,
        });
      }
    } catch (emailError) {
      console.error("Failed to send order status email:", emailError);
    }
    // --- END OF NOTIFICATION LOGIC ---

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
