jest.mock('../../models/buddy', () => ({
  countChecklistTasks: jest.fn(),
  countTasksCompletedByBothToday: jest.fn(),
  wasStreakAwardedToday: jest.fn(),
  incrementStreakForPair: jest.fn(),
}));

const Buddy = require('../../models/buddy');
const BuddyStreakObserver = require('../../observers/BuddyStreakObserver');

describe('Buddy Streak Observer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('awards a streak when both buddies complete every checklist task', () => {
    const observer = new BuddyStreakObserver();
    const event = { userId: 1, buddyId: 2, taskId: 5, completed: true };

    Buddy.countChecklistTasks.mockImplementation((firstUserId, secondUserId, callback) => {
      callback(null, [{ total: 1 }]);
    });
    Buddy.countTasksCompletedByBothToday.mockImplementation((firstUserId, secondUserId, callback) => {
      callback(null, [{ total: 1 }]);
    });
    Buddy.wasStreakAwardedToday.mockImplementation((userId, buddyId, callback) => {
      callback(null, []);
    });
    Buddy.incrementStreakForPair.mockImplementation((userId, buddyId, callback) => {
      callback(null, { affectedRows: 1 });
    });

    observer.update(event, (err, nextEvent) => {
      expect(err).toBeNull();
      expect(Buddy.incrementStreakForPair).toHaveBeenNthCalledWith(1, 1, 2, expect.any(Function));
      expect(Buddy.incrementStreakForPair).toHaveBeenNthCalledWith(2, 2, 1, expect.any(Function));
      expect(nextEvent).toEqual({
        userId: 1,
        buddyId: 2,
        taskId: 5,
        completed: true,
        streakAwarded: true,
        streakReason: 'completed',
      });
    });
  });

  test('does not award a streak when the task was unchecked', () => {
    const observer = new BuddyStreakObserver();
    const event = { userId: 1, buddyId: 2, taskId: 5, completed: false };

    observer.update(event, (err, nextEvent) => {
      expect(err).toBeNull();
      expect(Buddy.incrementStreakForPair).not.toHaveBeenCalled();
      expect(nextEvent).toEqual({
        userId: 1,
        buddyId: 2,
        taskId: 5,
        completed: false,
        streakAwarded: false,
      });
    });
  });
});
