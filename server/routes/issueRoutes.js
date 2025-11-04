// routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const sendEmail = require('../utils/email');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new support issue
// @route   POST /api/issues
// @access  Private (any logged-in user)
router.post('/', protect, async (req, res) => {
    const { subject, description } = req.body;
    const newIssue = new Issue({
        subject,
        description,
        user: req.user.id
    });
    await newIssue.save();
    // --- ADD THIS EMAIL NOTIFICATION LOGIC ---
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            const message = `A new support ticket has been submitted.\n\nFrom: ${req.user.username} (${req.user.email})\nSubject: ${subject}\n\nDescription:\n${description}\n\nPlease log in to the admin panel to address this issue.`;
            await sendEmail({
                email: adminEmail,
                subject: `🚨 New Support Ticket Submitted: "${subject}"`,
                message
            });
        }
    } catch (emailError) {
        console.error('Failed to send new issue notification email:', emailError);
    }
    // --- END OF NOTIFICATION LOGIC ---
    res.status(201).json({ message: 'Support ticket submitted successfully.' });
});

module.exports = router;