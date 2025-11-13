const db = require('../config/database');


const User = {
  create: (username, email, password, bio, profile_picture, country, gender, callback) => {
    const sql = 'INSERT INTO users (username, email, password, bio, profile_picture, country, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, email, password, bio, profile_picture, country, gender], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  createToken: (userId, token, expiresAt, callback) => {
    const sql = `INSERT INTO password_reset_tokens (user_id, token, expires_at)
                 VALUES (?, ?, ?)`;
    db.query(sql, [userId, token, expiresAt], callback);
  },

  findByToken: (token, callback) => {
    const sql = `SELECT * FROM password_reset_tokens WHERE token = ?`;
    db.query(sql, [token], callback);
  },

  deleteByUserId: (userId, callback) => {
    const sql = `DELETE FROM password_reset_tokens WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  }
};


module.exports = User;
