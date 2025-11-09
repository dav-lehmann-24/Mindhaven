const db = require('../config/database');

// Get user profile
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT id, username, email, bio, profile_picture, country, gender
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
  const { bio, profile_picture, country, gender } = req.body;
  const query = `
    UPDATE users 
    SET bio=?, profile_picture=?, country=?, gender=? 
    WHERE id=?`;
  db.query(query, [bio, profile_picture, country, gender, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating profile' });
    res.status(200).json({ message: 'Profile updated successfully' });
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
