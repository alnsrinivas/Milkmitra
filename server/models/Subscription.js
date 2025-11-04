const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farm: { // <-- ADD THIS ENTIRE BLOCK
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    plan: {
        type: String,
        required: [true, 'A subscription plan is required.'],
        enum: ['Premium Plan', 'Family Plan'] // Example plans
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;