import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT Signed Token
 * @param {string} id - User MongoDB ObjectId
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careerpilot_secret_key_jwt_2026', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user in DB
    const user = await User.create({
      name,
      email,
      password,
      targetRole: targetRole || 'Software Engineer'
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Validate password match
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
