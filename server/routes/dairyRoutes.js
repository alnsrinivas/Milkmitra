const express = require('express');
const router = express.Router();
const Dairy = require('../models/Dairy');
const { protect, isFarmer } = require('../middleware/authMiddleware');

// @desc    Get all dairy entries for the logged-in farmer
// @route   GET /api/dairy
// @access  Private/Farmer
router.get('/', protect, isFarmer, async (req, res) => {
    try {
        const entries = await Dairy.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        console.error("Error fetching dairy entries:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new dairy entry
// @route   POST /api/dairy
// @access  Private/Farmer
router.post('/', protect, isFarmer, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const newEntry = new Dairy({
            title,
            content,
            owner: req.user.id,
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error("Error creating dairy entry:", error);
        res.status(400).json({ message: 'Invalid data provided' });
    }
});

// @desc    Update a dairy entry
// @route   PUT /api/dairy/:id
// @access  Private/Farmer
router.put('/:id', protect, isFarmer, async (req, res) => {
    try {
        const entry = await Dairy.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Ensure the user owns the entry
        if (entry.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        entry.title = req.body.title || entry.title;
        entry.content = req.body.content || entry.content;

        const updatedEntry = await entry.save();
        res.json(updatedEntry);
    } catch (error) {
        console.error("Error updating dairy entry:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a dairy entry
// @route   DELETE /api/dairy/:id
// @access  Private/Farmer
router.delete('/:id', protect, isFarmer, async (req, res) => {
    try {
        const entry = await Dairy.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Ensure the user owns the entry
        if (entry.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        await Dairy.deleteOne({ _id: req.params.id });

        res.json({ message: 'Entry removed successfully' });
    } catch (error) {
        console.error("Error deleting dairy entry:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

