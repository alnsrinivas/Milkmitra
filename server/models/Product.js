const mongoose = require('mongoose');

// This schema defines the structure for a Product.
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Product type is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    unit: {
        type: String, // e.g., 'litre', 'kg', '250g'
        required: [true, 'Unit is required'],
        trim: true
    },
    image: {
        type: String, // We will store the URL path to the image
        required: [true , 'Image URL is required']
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId, // This links the product...
        ref: 'Farm', // ...to the farm that sells it.
        required: true
    },
    // --- ADD THIS FIELD ---
    stock: {
        type: Number,
        required: true,
        default: 100 // Assumes product is in stock by default
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
