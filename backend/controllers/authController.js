const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, image } = req.body;
    console.log('Received image data:', image);

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create user with image object structure
    const user = await User.create({
      name,
      email,
      password,
      address,
      image: {
        public_id: image.public_id,
        url: image.url
      },
      role: 'user'
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          image: user.image, // This will now return the object with public_id and url
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token // Include token in user object
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};