const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const { protect, isFarmer } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const sendEmail = require("../utils/email");
const Farm = require("../models/Farm");
const User = require("../models/User");
// --- CREATE OR UPDATE A SUBSCRIPTION ---
// URL: POST /api/subscriptions
// Access: Private (Logged-in customers)
// --- CREATE OR UPDATE A SUBSCRIPTION (NOW LINKED TO A FARM) ---
// In routes/subscriptionRoutes.js, replace the entire POST route

router.post("/", protect, async (req, res) => {
  const { plan, productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const farmId = product.farm;

    // 1. Check if an active subscription for this farm already exists.
    const existingSubscription = await Subscription.findOne({
      customer: req.user.id,
      farm: farmId,
    });
    const isNewSubscription =
      !existingSubscription || existingSubscription.status === "cancelled";

    // 2. Update or create the subscription.
    const subscription = await Subscription.findOneAndUpdate(
      { customer: req.user.id, farm: farmId },
      {
        customer: req.user.id,
        farm: farmId,
        plan,
        status: "active",
        startDate: new Date(),
      },
      { new: true, upsert: true }
    );

    // 3. Send an email ONLY if it's a brand new subscription.
    if (isNewSubscription && farm && farm.owner && farm.owner.email) {
            try {
                // We use farm.owner.username for a better greeting
                const farmerUsername = farm.owner.username || "Farm Owner";
                const message = `Dear ${farmerUsername},\n\n🎉 A customer has subscribed to your farm (${farm.farmName})!\n\nCustomer: ${customer.username}\nPlan: ${plan}\n\nYou can view all your subscribers in your dashboard.`;
                
                await sendEmail({
                    email: farm.owner.email, // This is the correct email
                    subject: '🎉 New Subscriber! - MilkMitra',
                    message
                });
            } catch (emailError) {
                console.error('CRITICAL: Failed to send new subscription email to farmer:', emailError);
                // Log the farm data to see if the email address is missing
                console.log('Farmer Email Status:', farm.owner ? farm.owner.email : 'Owner object missing');
            }
        } else if (isNewSubscription) {
            // This is a debug block to confirm why the email wasn't sent
            console.error('Farmer Email NOT Sent: Missing farm, owner, or owner email.');
        }

    res.status(201).json(subscription);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while updating subscription." });
  }
});

// --- GET ALL SUBSCRIBERS FOR A FARMER'S FARM ---
// URL: GET /api/subscriptions/farm
// Access: Private (Farmers only)
router.get("/farm", protect, isFarmer, async (req, res) => {
  try {
    const Farm = require("../models/Farm");
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found for this user." });
    }

    const subscriptions = await Subscription.find({ farm: farm._id })
      .populate("customer", "username email phone") // Get subscriber details
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching subscribers." });
  }
});
// --- GET THE CURRENT USER'S SUBSCRIPTION ---
// URL: GET /api/subscriptions/my
// Access: Private (Logged-in customers)
router.get("/my", protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ customer: req.user.id });
    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found." });
    }
    res.json(subscription);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching subscription." });
  }
});

// --- CANCEL A SUBSCRIPTION ---
// URL: PATCH /api/subscriptions/cancel
// Access: Private (Logged-in customers)
router.patch("/cancel", protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ customer: req.user.id });

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscription found to cancel." });
    }

    subscription.status = "cancelled";
    await subscription.save();
    res.json({ message: "Subscription cancelled successfully.", subscription });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while cancelling subscription." });
  }
});

module.exports = router;
