const Journal = require('../models/journal');

exports.createJournal = (req, res) => {
  const userId = req.user.id;
  const { title, content, tags  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }


  Journal.createJournal( userId, title, content, tags, (err, result) => {
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


exports.updateJournal = (req, res) => {
  
  const userId = req.user.id;
  const journalId = req.params.id;
  const { title, content, tags } = req.body;

  Journal.checkOwnership(journalId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (rows.length === 0) return res.status(404).json({ message: 'Journal not found' });
    if (rows[0].user_id !== userId)
      return res.status(403).json({ message: 'Unauthorized: not your journal' });

    
  Journal.updateJournal(journalId, title, content, tags, (err, result) => {
      if (err) {
        console.error('❌ Error updating journal:', err);
        return res.status(500).json({ message: 'Error updating journal' });
      }
      res.status(200).json({ message: '✅ Journal updated successfully' });
    });
  });
};


exports.deleteJournal = (req, res) => {
  const userId = req.user.id;
  const journalId = req.params.id;

Journal.checkOwnership(journalId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (rows.length === 0) return res.status(404).json({ message: 'Journal not found' });
    if (rows[0].user_id !== userId)
      return res.status(403).json({ message: 'Unauthorized: not your journal' });

    Journal.deleteJournal(journalId, (err) => {
      if (err) {
        console.error('❌ Error deleting journal:', err);
        return res.status(500).json({ message: 'Error deleting journal' });
      }
      res.status(200).json({ message: '🗑️ Journal deleted successfully!' });
    });
  });
};


exports.getJournalsByUserId = (req, res) => {
  const userId = req.user.id;
  Journal.getJournalsByUserId(userId, (err, result) => {
    if (err) {
      console.error('Error fetching journals:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    // tags als Array zurückgeben
    const journals = result.map(journal => ({
      ...journal,
      tags: typeof journal.tags === 'string' ? journal.tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(journal.tags) ? journal.tags : []
    }));
    res.status(200).json({ journals });
  });
};
