const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Farm = require("../models/Farm");
const Review = require("../models/Review");
const { protect, isFarmer } = require("../middleware/authMiddleware"); // Import our new middleware

// --- GET ALL PRODUCTS ---
// URL: GET /api/products
// Access: Public
// In routes/productRoutes.js, replace the existing router.get('/', ...) with this:
// In routes/productRoutes.js, REPLACE the entire GET /api/products route with this:

router.get("/", async (req, res) => {
  try {
    const { type, sort, lat, lon, q } = req.query;
    let pipeline = [];

    // STAGE 1: Find and sort farms by distance (if location is provided)
    // This is the only way to correctly use the 2dsphere index first.
    if (lat && lon) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          distanceField: "distance", // This will add the distance to the farm document
          spherical: true,
        },
      });
    }

    // STAGE 2: Join 'farms' with 'products'
    pipeline.push({
      $lookup: {
        from: "products", // The collection to join with
        localField: "_id", // Field from the 'farms' collection
        foreignField: "farm", // Field from the 'products' collection
        as: "products", // The new array field to add
      },
    });

    // STAGE 3: Unwind the products array to create a separate document for each product
    pipeline.push({ $unwind: "$products" });
    pipeline.push({
      $lookup: {
        from: "reviews", // The reviews collection
        localField: "products._id", // Product ID from the current document
        foreignField: "product", // Product ID in the Review model
        as: "reviews", // New array field with all reviews
      },
    });
    pipeline.push({
      $addFields: {
        averageRating: { $avg: "$reviews.rating" }, // Calculate average rating
        reviewCount: { $size: "$reviews" }, // Count the number of reviews
      },
    });

    // STAGE 4: Reshape the document to look like a product, but keep farm details
    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$products",
            {
              farm: {
                _id: "$_id",
                farmName: "$farmName",
                address: "$address",
                owner: "$owner",
              },
              distance: "$distance",
              averageRating: "$averageRating",
              reviewCount: "$reviewCount", // Carry over the distance from the $geoNear stage
            },
          ],
        },
      },
    });

    // STAGE 5: Match based on filters (milk type, search query)
    const matchStage = {};
    if (type && type !== "all") {
      matchStage.type = type;
    }
    if (q) {
      matchStage.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { "farm.farmName": { $regex: q, $options: "i" } }, // Now we can search by farm name
      ];
    }
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // STAGE 6: Sorting (price or default)
    let sortStage = {};
    if (sort === "price_asc") {
      sortStage = { price: 1 };
    } else if (sort === "price_desc") {
      sortStage = { price: -1 };
    } else if (!lat || !lon) {
      // Only apply default sort if not already sorted by distance
      sortStage = { createdAt: -1 };
    }
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    // Execute the aggregation pipeline, starting from the Farm collection
    const products = await Farm.aggregate(pipeline);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});
// --- CREATE A NEW PRODUCT ---
// URL: POST /api/products
// Access: Private (only for logged-in farmers)
router.post("/", protect, isFarmer, async (req, res) => {
  try {
    const { name, description, price, unit, image, type } = req.body;

    // Find the farm associated with the logged-in user (farmer)
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found for this user." });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      unit,
      image,
      type,
      farm: farm._id, // Link the product to the farm
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Server Error: Could not create product." });
  }
});
// PASTE THESE THREE NEW ROUTES INTO productRoutes.js

// --- GET ALL PRODUCTS FOR A SPECIFIC FARMER ---
// URL: GET /api/products/myproducts
// Access: Private (Farmers only)
router.get("/myproducts", protect, isFarmer, async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found for this user." });
    }
    const products = await Product.find({ farm: farm._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Could not fetch farmer's products." });
  }
});

// --- UPDATE A PRODUCT ---
// URL: PUT /api/products/:id
// Access: Private (Farmers only)
router.put("/:id", protect, isFarmer, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const farm = await Farm.findOne({ owner: req.user.id });
    if (product.farm.toString() !== farm._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this product." });
    }

    const { name, description, price, unit, image, type } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.unit = unit || product.unit;
    product.image = image || product.image;
    product.type = type || product.type;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Could not update product." });
  }
});

// --- DELETE A PRODUCT ---
// URL: DELETE /api/products/:id
// Access: Private (Farmers only)
router.delete("/:id", protect, isFarmer, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const farm = await Farm.findOne({ owner: req.user.id });
    if (product.farm.toString() !== farm._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this product." });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Could not delete product." });
  }
});

// Paste this entire block into routes/productRoutes.js

// --- TOGGLE PRODUCT STOCK STATUS ---
// URL: PATCH /api/products/:id/stock
// Access: Private (Farmers only)
router.patch("/:id/stock", protect, isFarmer, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 1. Authorization check: Ensure the product belongs to the farmer's farm
    const farm = await Farm.findOne({ owner: req.user.id });
    if (product.farm.toString() !== farm._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this product." });
    }

    // 2. Toggle the stock status
    // If stock is > 0, set to 0 (Out of Stock). If stock is 0, set to 100 (In Stock).
    product.stock = product.stock > 0 ? 0 : 100;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error toggling stock:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
// module.exports = router;

module.exports = router;
