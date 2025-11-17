const db = require('../config/database');
const User = require('../models/user');
// Get user profile
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT id, username, email, bio, profile_picture, country, gender, created_at, updated_at
    FROM users WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result[0]);
  });
};

// Update profile
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { username, bio, profile_picture, country, gender } = req.body;
  // Check, if username already exists for another user
  const checkQuery = 'SELECT id FROM users WHERE username = ? AND id <> ?';
  db.query(checkQuery, [username, userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Username is available, proceed with update
    const updateQuery = `
      UPDATE users 
      SET username=?, bio=?, profile_picture=?, country=?, gender=? 
      WHERE id=?`;
    db.query(updateQuery, [username, bio, profile_picture, country, gender, userId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error updating profile' });
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  });
};

// Get user journals
exports.getUserJournals = (req, res) => {
  const userId = req.user.id;
  console.log('Decoded user ID from token:', userId);
  const query = `
    SELECT id, title, content, tags, created_at
    FROM journals WHERE user_id = ? ORDER BY created_at DESC`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching journals' });
    res.status(200).json(result);
  });
};


exports.uploadProfilePicture = (req, res) => {
  const userId = req.user.id;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!filePath) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const query = `UPDATE users SET profile_picture = ? WHERE id = ?`;
  db.query(query, [filePath, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating profile picture' });
    res.status(200).json({
      message: 'Profile picture updated successfully',
      imageUrl: filePath,
    });
  });
};

exports.deleteAccount = (req, res) => {
  const userId = req.user.id; 

  User.getcheckOwnership(userId, (err, rows) => {
    if (err) {
      console.error('❌ Database error during ownership check:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (rows[0].id !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: not your account' });
    }
    User.deleteById(userId, (err2, result) => {
      if (err2) {
        console.error('❌ Error deleting account:', err2);
        return res.status(500).json({ message: 'Error deleting account' });
      }

      res
        .status(200)
        .json({ message: '🗑️ Account deleted successfully!' });
    });
  });
};
