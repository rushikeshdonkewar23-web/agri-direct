const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token Generate Function
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'agridirect_super_secret_key_123', {
    expiresIn: '30d',
  });
};

// 1. Register User API Logic
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, district } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      district,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login User API Logic
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};