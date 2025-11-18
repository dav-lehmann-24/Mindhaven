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

    deleteJournal: (id, callback) => {
    const sql = `
    DELETE FROM journals WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  checkOwnership: (journalId, callback) => {
  const sql = 'SELECT user_id FROM journals WHERE id = ?';
  db.query(sql, [journalId], callback);
  },


  getJournalsByUserId: (userId, callback) => {
    db.query(
      `SELECT id, title, content, tags, created_at FROM journals WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
      callback
    );
  },

  getJournalById: (journalId, callback) => {
    const sql = `SELECT id, user_id, title, content, tags, created_at, updated_at FROM journals WHERE id = ?`;
    db.query(sql, [journalId], (err, results) => {
      if (err) return callback(err);
      if (!results.length) return callback(null, null);
      const journal = results[0];
      journal.tags = typeof journal.tags === 'string' ? journal.tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(journal.tags) ? journal.tags : [];
      callback(null, journal);
    });
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

