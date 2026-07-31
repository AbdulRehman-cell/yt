const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user id', error: error.message });
    }
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    const { username, bio, traits, avatar, isMatched } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });
    
    const newUser = new User({ username, bio, traits, avatar, isMatched: isMatched || false });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error creating user', error: error.message });
    }
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user id', error: error.message });
    }
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;