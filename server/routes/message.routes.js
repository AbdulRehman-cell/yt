const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching messages', error: error.message });
  }
});

// GET message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(message);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).json({ message: 'Error fetching message', error: error.message });
  }
});

// POST new message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'Missing required message fields' });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      timestamp: new Date()
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error creating message', error: error.message });
    }
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
});

// PUT update message
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    );
    if (!updatedMessage) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(updatedMessage);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(400).json({ message: 'Error updating message', error: error.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json({ message: 'Message successfully deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

module.exports = router;