const bcrypt = require('bcryptjs');
const User = require('../models/auth');
const jwt = require('jsonwebtoken');

exports.registerUser = (req, res) => {
  const { username, email, password, bio, profile_picture, country, gender } = req.body;


//   console.log('Request body:', req.body);

// hashing
const hashedPassword = bcrypt.hashSync(password, 10);


  User.create(username, email, hashedPassword, bio, profile_picture, country, gender, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error registering user' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
};



exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if both email & password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Look for user in DB
  const User = require('../models/auth');
  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // No user found
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    // const bcrypt = require('bcryptjs');

    // Compare entered password with hashed password in DB
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Success
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        gender: user.gender,
      },
    });
  });
};
