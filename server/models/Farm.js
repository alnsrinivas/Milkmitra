// In models/Farm.js, replace the entire farmSchema
const mongoose = require('mongoose');
const farmSchema = new mongoose.Schema({
    farmName: { type: String, required: true, trim: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true, trim: true },
    
    // --- NEW GEOJSON LOCATION FIELD ---
    // We are keeping latitude and longitude for simplicity but adding a
    // dedicated 'location' field for efficient geospatial queries.
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers for [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

// --- ADD THE 2DSPHERE INDEX ---
farmSchema.index({ location: '2dsphere' });

// IMPORTANT: We need to ensure the 'location' field is automatically populated
// before any farm is saved.
farmSchema.pre('save', function(next) {
    if (this.isModified('latitude') || this.isModified('longitude')) {
        this.location = {
            type: 'Point',
            // NOTE: MongoDB requires the order [longitude, latitude]
            coordinates: [this.longitude, this.latitude]
        };
    }
    next();
});

const Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;