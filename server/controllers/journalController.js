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


exports.updateJournal = (req,res) => {
  const id = req.params.id;
  const { title, content, tags } = req.body;
  Journal.updateJournal(id, title, content, tags, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating journal' });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Journal not found' });
    res.status(200).json({ message: '✅ Journal updated successfully' });
  });
}