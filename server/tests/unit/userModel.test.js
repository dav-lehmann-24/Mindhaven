jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

const db = require('../../config/database');
const User = require('../../models/user');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createToken inserts a password reset token', () => {
    const callback = jest.fn();
    User.createToken(7, 'token-123', '2026-05-01 10:00:00', callback);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO password_resets'),
      [7, 'token-123', '2026-05-01 10:00:00'],
      callback
    );
  });

  test('update updates editable profile fields', () => {
    const callback = jest.fn();
    User.update(3, 'hafsa', 'bio', '/img.png', 'DE', 'female', callback);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users SET username=?'),
      ['hafsa', 'bio', '/img.png', 'DE', 'female', 3],
      callback
    );
  });
});
