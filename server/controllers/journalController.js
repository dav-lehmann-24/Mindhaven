const Journal = require('../models/journal');

exports.createJournal = (req, res) => {
  const { user_id, title, content, tags  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  Journal.createJournal(user_id, title, content, tags, (err, result) => {
    if (err) {
      console.error('❌ Error creating journal:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({
      message: 'Journal created successfully!',
      journalId: result.insertId
    });
  });
};


