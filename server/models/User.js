const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This is the blueprint for our User data.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true // Removes whitespace from both ends
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // No two users can have the same email
        lowercase: true, // Stores email in lowercase
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['customer', 'farmer','admin'], // The role can only be one of these two values
        default: 'customer' // If no role is specified, they are a customer by default
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true 
});

// This is a special function that runs BEFORE a new user is saved to the database.
// Its purpose is to securely encrypt the password.
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // "Salt" the password for extra security, then hash it.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model so we can use it in other files
module.exports = User;
