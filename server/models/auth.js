const db = require('../config/database');


const User = {
  create: (username, email, password, bio, profile_picture, country, gender, callback) => {
    const sql = 'INSERT INTO users (username, email, password, bio, profile_picture, country, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, email, password, bio, profile_picture, country, gender], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }
};

module.exports = User;
