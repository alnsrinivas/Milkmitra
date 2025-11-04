// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    }
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;