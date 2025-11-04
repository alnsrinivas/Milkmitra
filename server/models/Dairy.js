const mongoose = require('mongoose');

const dairySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
}, {
  timestamps: true,
});

const Dairy = mongoose.model('Dairy', dairySchema);

module.exports = Dairy;

