const bcrypt = require('bcryptjs');
const Auth = require('../models/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');
const { sendResetEmail } = require('../utils/emailService');



exports.registerUser = (req, res) => {
  const { username, email, password, bio, profile_picture, country, gender } = req.body;

// hashing
const hashedPassword = bcrypt.hashSync(password, 10);

  Auth.create(username, email, hashedPassword, bio, profile_picture, country, gender, (err, result) => {
    if (err) {
      console.error('❌ Registration error:', err.sqlMessage || err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: 'Username or email already exists. Please use a different one.',
        });
      }
      return res.status(500).json({ message: 'Error registering user' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
    console.log('✅ Response sent to client');
  });
};



exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if both email & password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Look for user in DB
  Auth.findByEmail(email, (err, results) => {
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


exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const userId = results[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    User.deleteByUserId(userId, () => {
      User.createToken(userId, token, expiresAt, (err2) => {
        if (err2) return res.status(500).json({ message: 'Database error' });

        sendResetEmail(email, token)
        .then(() => {
          res.status(200).json({ message: '📧 Password reset link sent to your email!' });
        })
        .catch((error) => {
          console.error(' Error sending email:', error);
          res.status(500).json({ message: 'Error sending reset email' });
        });
      });
    });
  });
};


exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: 'Token and new password are required' });

  User.findByToken(token, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid or expired token' });

    const record = results[0];
    if (new Date(record.expires_at) < new Date())
      return res.status(400).json({ message: 'Token expired' });

    const hashed = bcrypt.hashSync(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, record.user_id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error updating password' });

      User.deleteByUserId(record.user_id, () => {
        res.status(200).json({ message: 'Password reset successful!' });
      });
    });
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { bio, country, gender } = req.body;
  const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

  User.checkOwnership(userId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    User.updateProfile(userId, bio, country, gender, profile_picture, (err2) => {
      if (err2) {
        console.error('❌ Error updating profile:', err2);
        return res.status(500).json({ message: 'Error updating profile' });
      }
      res.status(200).json({ message: '✅ Profile updated successfully!' });
    });
  });
};