const db = require('../config/database');

const Journal = {
  createJournal: (userId, title, content, tags, callback) => {
    const sql = `
      INSERT INTO journals (user_id, title, content, tags )
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [userId, title, content, tags], callback);
  },

    updateJournal: (id, title, content, tags, callback) => {
    const sql = `
      UPDATE journals
      SET title = ?, content = ?, tags = ?
      WHERE id = ?
    `;
    db.query(sql, [title, content, tags, id], callback);
  },

};

module.exports = Journal;



// exports.createJournal = async (userId, title, content, tag) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       `INSERT INTO journals (user_id, title, content, tags)
//        VALUES (?, ?, ?, ?)`,
//       [userId, title, content, tag],
//       (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       }
//     );
//   });
// };

