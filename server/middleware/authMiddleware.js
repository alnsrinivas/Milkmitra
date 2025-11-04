const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require a user to be logged in
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an authorization header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token's payload (excluding the password)
            req.user = await User.findById(decoded.user.id).select('-password');
            
            next(); // Move on to the next piece of middleware or the route handler
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if the logged-in user is a farmer
const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Farmer role required.' });
    }
};
// Middleware to check if the logged-in user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = { protect, isFarmer,isAdmin};
