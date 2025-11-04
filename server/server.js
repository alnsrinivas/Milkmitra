// Import necessary packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const farmRoutes = require('./routes/farmRoutes'); // Import farm routes
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dairyRoutes = require('./routes/dairyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const issueRoutes = require('./routes/issueRoutes');
// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/farms', farmRoutes);     // Use farm routes
app.use('/api/orders', orderRoutes);   // Use order routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dairy', dairyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/issues', issueRoutes);
// Simple test route
app.get('/', (req, res) => {
    res.send('Hello from the MilkMitra Backend Server!');
});
// --- Not Found and Error Handling Middleware ---

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: 'The requested resource was not found on this server.' });
});

// Generic Error Handler (should be the very last middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
});

