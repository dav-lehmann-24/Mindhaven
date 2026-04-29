jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

const db = require('../../config/database');
const Buddy = require('../../models/buddy');

describe('Buddy Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findUserById queries the users table', () => {
    const callback = jest.fn();
    Buddy.findUserById(12, callback);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM users'), [12], callback);
  });

  test('createRequest inserts a pending buddy request', () => {
    const callback = jest.fn();
    Buddy.createRequest(12, 13, callback);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("VALUES (?, ?, 0, 'pending')"), [12, 13], callback);
  });

  test('incrementStreakForPair updates the streak and award date', () => {
    const callback = jest.fn();
    Buddy.incrementStreakForPair(12, 13, callback);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SET streak = streak + 1, last_streak_awarded_on = CURDATE()'),
      [12, 13],
      callback
    );
  });
});
