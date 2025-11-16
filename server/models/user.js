const db = require('../config/database');

const User = {
  findById: (id, callback) => {
    db.query(
      `SELECT id, username, email, bio, profile_picture, country, gender, updated_at FROM users WHERE id = ?`,
      [id],
      callback
    );
  },

  update: (id, bio, picture, country, gender, callback) => {
    db.query(
      `UPDATE users SET bio=?, profile_picture=?, country=?, gender=? WHERE id=?`,
      [bio, picture, country, gender, id],
      callback
    );
  },

  getJournals: (userId, callback) => {
    db.query(
      `SELECT id, title, content, tags, created_at FROM journals WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
      callback
    );
  },

  getcheckOwnership : (userId, callback) => {
  const sql = 'SELECT id FROM users WHERE id = ?';
  db.query(sql, [userId], callback);
},

deleteById : (userId, callback) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], callback);
}
  
};

module.exports = User;
