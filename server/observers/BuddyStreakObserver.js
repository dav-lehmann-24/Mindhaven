const Buddy = require('../models/buddy');

class BuddyStreakObserver {
  update(event, callback) {
    if (!event.completed) {
      return callback(null, { ...event, streakAwarded: false });
    }

    const [firstUserId, secondUserId] = [Math.min(event.userId, event.buddyId), Math.max(event.userId, event.buddyId)];

    Buddy.countChecklistTasks(firstUserId, secondUserId, (taskErr, taskRows) => {
      if (taskErr) return callback(taskErr);

      const totalTasks = taskRows[0] ? Number(taskRows[0].total) : 0;
      if (totalTasks === 0) {
        return callback(null, { ...event, streakAwarded: false, streakReason: 'no_tasks' });
      }

      Buddy.countTasksCompletedByBothToday(firstUserId, secondUserId, (completedErr, completedRows) => {
        if (completedErr) return callback(completedErr);

        const completedByBoth = completedRows[0] ? Number(completedRows[0].total) : 0;
        if (completedByBoth !== totalTasks) {
          return callback(null, { ...event, streakAwarded: false, streakReason: 'incomplete' });
        }

        Buddy.wasStreakAwardedToday(event.userId, event.buddyId, (awardedErr, awardedRows) => {
          if (awardedErr) return callback(awardedErr);
          if (awardedRows.length > 0) {
            return callback(null, { ...event, streakAwarded: false, streakReason: 'already_awarded' });
          }

          Buddy.incrementStreakForPair(event.userId, event.buddyId, (incrementErr) => {
            if (incrementErr) return callback(incrementErr);

            Buddy.incrementStreakForPair(event.buddyId, event.userId, (mirrorErr) => {
              if (mirrorErr) return callback(mirrorErr);

              return callback(null, { ...event, streakAwarded: true, streakReason: 'completed' });
            });
          });
        });
      });
    });
  }
}

module.exports = BuddyStreakObserver;
