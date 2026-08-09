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

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone number' });
    }

    const userRole = (role && ['FARMER', 'BUYER', 'ADMIN'].includes(role.toUpperCase())) 
      ? role.toUpperCase() 
      : 'FARMER';

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: userRole,
      district: district || 'Maharashtra',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
    const { email, password, phone, identifier } = req.body;
    const loginId = (email || phone || identifier || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Email/Mobile and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: loginId.toLowerCase() }, { phone: loginId }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/mobile or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};