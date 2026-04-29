jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

const db = require('../../config/database');
const Journal = require('../../models/journal');

describe('Journal Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createJournal inserts a journal row', () => {
    const callback = jest.fn();
    Journal.createJournal(1, 'Title', 'Body', 'calm,hopeful', callback);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO journals'),
      [1, 'Title', 'Body', 'calm,hopeful'],
      callback
    );
  });

  test('getJournalById converts comma-separated tags into an array', () => {
    const callback = jest.fn();
    db.query.mockImplementation((sql, params, handler) => {
      handler(null, [{ id: 5, title: 'Entry', tags: 'calm, hopeful, grateful' }]);
    });

    Journal.getJournalById(5, callback);

    expect(callback).toHaveBeenCalledWith(null, expect.objectContaining({
      id: 5,
      tags: ['calm', 'hopeful', 'grateful'],
    }));
  });
});
