// Chat History Model - AI chat conversations store karne ke liye

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kundaliId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kundali',
    required: true
  },
  messages: [messageSchema],
  title: {
    type: String,
    default: 'Kundali Chat'
  }
}, {
  timestamps: true
});

chatHistorySchema.index({ userId: 1, kundaliId: 1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
