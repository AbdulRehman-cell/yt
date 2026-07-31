const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: [true, 'Sender ID is required'],
      trim: true,
      index: true
    },
    receiverId: {
      type: String,
      required: [true, 'Receiver ID is required'],
      trim: true,
      index: true
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Message too long']
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { 
    timestamps: true 
  }
);

// Index for efficient chat retrieval between two users
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);