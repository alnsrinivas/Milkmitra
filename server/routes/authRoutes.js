const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Farm = require('../models/Farm');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');

// --- REGISTRATION ROUTE ---
// In routes/authRoutes.js

// --- CUSTOMER REGISTRATION ROUTE (WITH OTP) ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // 1. Check if a verified user with this email already exists
        const userExists = await User.findOne({ email });
        if (userExists && userExists.isVerified) {
            return res.status(400).json({ message: 'A verified user with this email already exists.' });
        }
        
        // 2. Create or update the customer user document
        const newUser = userExists || new User();
        Object.assign(newUser, { 
            username, 
            email, 
            phone, 
            password, 
            role: 'customer' // Explicitly set the role
        });

        // 3. Generate and store the OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        newUser.emailVerificationToken = otp;
        newUser.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        newUser.isVerified = false;

        await newUser.save();

        // 4. Send the OTP email
        try {
            const message = `Welcome to Milk Mitra! Your One-Time Password (OTP) for email verification is: ${otp}\nThis code will expire in 10 minutes.`;
            await sendEmail({
                email: newUser.email,
                subject: 'Your Milk Mitra Verification Code',
                message
            });

            res.status(200).json({ message: 'Registration successful! Please check your email for the OTP.', email: newUser.email });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error sending verification email.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});


// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Account not verified. Please check your email for the OTP.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});
// --- FARMER REGISTRATION (USER + FARM) ---
// In routes/authRoutes.js
// In server/routes/authRoutes.js

router.post('/register-farmer', async (req, res) => {
    const { username, email, phone, password, farmName, address, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userExists = await User.findOne({ email }).session(session);
        if (userExists && userExists.isVerified) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'A verified user with this email already exists.' });
        }

        // --- THE FIX: Prepare all data before saving ---

        // 1. Prepare the user object (don't save yet)
        const user = userExists || new User();
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        Object.assign(user, {
            username, email, phone, password, role: 'farmer',
            emailVerificationToken: otp,
            emailVerificationExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false
        });

        // 2. Prepare the farm object (don't save yet)
        const farm = await Farm.findOneAndUpdate(
            { owner: user._id }, // Find by user ID
            { 
                owner: user._id,
                farmName,
                address,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            },
            { upsert: true, new: true, session: session }
        );

        // 3. Link them together
        user.farm = farm._id;

        // 4. Now, save the user document just ONCE
        await user.save({ session });
        
        // --- END OF FIX ---

        await session.commitTransaction();

        const message = `Welcome to Milk Mitra! Your One-Time Password (OTP) for email verification is: ${otp}\nThis code will expire in 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Your Milk Mitra Verification Code',
            message
        });

        res.status(200).json({ message: 'Registration successful! Please check your email for the OTP.', email: user.email });

    } catch (error) {
        await session.abortTransaction();
        console.error("Farmer registration error:", error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    } finally {
        session.endSession();
    }
});
// --- VERIFY OTP ---
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
        email,
        emailVerificationToken: otp, 
        emailVerificationExpires: { $gt: Date.now() } 
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
});
// --- FORGOT PASSWORD ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Note: We don't reveal if the user was found for security reasons
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        // 1. Generate a random, secure token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Hash the token and set it on the user model
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // Token is valid for 15 minutes

        await user.save();

        // 3. Create the reset URL for the email
        // This URL points to the page on your React frontend
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

        // 4. Send the email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request for Milk Mitra',
            message,
        });

        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

    } catch (error) {
        // In case of an error, clear the token fields to prevent a failed state
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
        }
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Error sending password reset email.' });
    }
});

// --- RESET PASSWORD ---
router.patch('/reset-password/:token', async (req, res) => {
    try {
        // 1. Get the hashed token from the URL
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // 2. Find the user by the hashed token and check if it's still valid
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // 3. Set the new password and clear the reset token fields
        user.password = req.body.password; // The pre-save hook will hash this
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error while resetting password.' });
    }
});
module.exports = router;

