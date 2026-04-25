const db = require('../config/database');

const Buddy = {
  findUserById: (userId, callback) => {
    const sql = `
      SELECT id, username, email, bio, profile_picture, country, gender
      FROM users
      WHERE id = ?`;
    db.query(sql, [userId], callback);
  },

  findRequest: (userId, buddyId, callback) => {
    const sql = `
      SELECT id, user_id, buddy_id, streak, status
      FROM buddies
      WHERE user_id = ? AND buddy_id = ?`;
    db.query(sql, [userId, buddyId], callback);
  },

  createRequest: (userId, buddyId, callback) => {
    const sql = `
      INSERT INTO buddies (user_id, buddy_id, streak, status)
      VALUES (?, ?, 0, 'pending')`;
    db.query(sql, [userId, buddyId], callback);
  },

  acceptRequest: (userId, buddyId, callback) => {
    const sql = `
      UPDATE buddies
      SET status = 'accepted'
      WHERE user_id = ? AND buddy_id = ?`;
    db.query(sql, [userId, buddyId], callback);
  },

  createAcceptedConnection: (userId, buddyId, streak, callback) => {
    const sql = `
      INSERT INTO buddies (user_id, buddy_id, streak, status)
      VALUES (?, ?, ?, 'accepted')`;
    db.query(sql, [userId, buddyId, streak], callback);
  },

  listPendingRequests: (userId, callback) => {
    const sql = `
      SELECT
        b.id,
        b.user_id,
        b.buddy_id,
        b.streak,
        b.status,
        CASE
          WHEN b.user_id = ? THEN 'outgoing'
          ELSE 'incoming'
        END AS direction,
        u.id AS profile_id,
        u.username,
        u.email,
        u.bio,
        u.profile_picture,
        u.country,
        u.gender
      FROM buddies b
      INNER JOIN users u
        ON u.id = CASE
          WHEN b.user_id = ? THEN b.buddy_id
          ELSE b.user_id
        END
      WHERE (b.user_id = ? OR b.buddy_id = ?) AND b.status = 'pending'
      ORDER BY u.username ASC`;
    db.query(sql, [userId, userId, userId, userId], callback);
  },

  listBuddies: (userId, callback) => {
    const sql = `
      SELECT
        b.id,
        b.user_id,
        b.buddy_id,
        b.streak,
        b.status,
        CASE
          WHEN b.user_id = ? THEN 'outgoing'
          ELSE 'incoming'
        END AS direction,
        u.id AS profile_id,
        u.username,
        u.email,
        u.bio,
        u.profile_picture,
        u.country,
        u.gender
      FROM buddies b
      INNER JOIN users u
        ON u.id = CASE
          WHEN b.user_id = ? THEN b.buddy_id
          ELSE b.user_id
        END
      WHERE (b.user_id = ? OR b.buddy_id = ?) AND b.status = 'accepted'
      ORDER BY u.username ASC`;
    db.query(sql, [userId, userId, userId, userId], callback);
  },

  listChecklistTasks: (firstUserId, secondUserId, currentUserId, callback) => {
    const partnerId = currentUserId === firstUserId ? secondUserId : firstUserId;
    const sql = `
      SELECT
        t.id,
        t.title,
        t.created_by,
        t.created_at,
        CASE WHEN self_completion.id IS NULL THEN false ELSE true END AS completed_by_me,
        CASE WHEN partner_completion.id IS NULL THEN false ELSE true END AS completed_by_buddy
      FROM buddy_tasks t
      LEFT JOIN buddy_task_completions self_completion
        ON self_completion.task_id = t.id
       AND self_completion.user_id = ?
       AND self_completion.completed_on = CURDATE()
      LEFT JOIN buddy_task_completions partner_completion
        ON partner_completion.task_id = t.id
       AND partner_completion.user_id = ?
       AND partner_completion.completed_on = CURDATE()
      WHERE t.user_id = ? AND t.buddy_id = ?
      ORDER BY t.created_at ASC, t.id ASC`;
    db.query(sql, [currentUserId, partnerId, firstUserId, secondUserId], callback);
  },

  createChecklistTask: (firstUserId, secondUserId, createdBy, title, callback) => {
    const sql = `
      INSERT INTO buddy_tasks (user_id, buddy_id, created_by, title)
      VALUES (?, ?, ?, ?)`;
    db.query(sql, [firstUserId, secondUserId, createdBy, title], callback);
  },

  findChecklistTask: (taskId, firstUserId, secondUserId, callback) => {
    const sql = `
      SELECT id, user_id, buddy_id, created_by, title, created_at
      FROM buddy_tasks
      WHERE id = ? AND user_id = ? AND buddy_id = ?`;
    db.query(sql, [taskId, firstUserId, secondUserId], callback);
  },

  markTaskCompleteForToday: (taskId, userId, callback) => {
    const sql = `
      INSERT INTO buddy_task_completions (task_id, user_id, completed_on, completed_at)
      VALUES (?, ?, CURDATE(), NOW())
      ON DUPLICATE KEY UPDATE completed_at = NOW()`;
    db.query(sql, [taskId, userId], callback);
  },

  unmarkTaskCompleteForToday: (taskId, userId, callback) => {
    const sql = `
      DELETE FROM buddy_task_completions
      WHERE task_id = ? AND user_id = ? AND completed_on = CURDATE()`;
    db.query(sql, [taskId, userId], callback);
  },

  countChecklistTasks: (firstUserId, secondUserId, callback) => {
    const sql = `
      SELECT COUNT(*) AS total
      FROM buddy_tasks
      WHERE user_id = ? AND buddy_id = ?`;
    db.query(sql, [firstUserId, secondUserId], callback);
  },

  countTasksCompletedByBothToday: (firstUserId, secondUserId, callback) => {
    const sql = `
      SELECT COUNT(*) AS total
      FROM buddy_tasks t
      INNER JOIN buddy_task_completions c1
        ON c1.task_id = t.id
       AND c1.user_id = ?
       AND c1.completed_on = CURDATE()
      INNER JOIN buddy_task_completions c2
        ON c2.task_id = t.id
       AND c2.user_id = ?
       AND c2.completed_on = CURDATE()
      WHERE t.user_id = ? AND t.buddy_id = ?`;
    db.query(sql, [firstUserId, secondUserId, firstUserId, secondUserId], callback);
  },

  incrementStreakForPair: (userId, buddyId, callback) => {
    const sql = `
      UPDATE buddies
      SET streak = streak + 1, last_streak_awarded_on = CURDATE()
      WHERE user_id = ? AND buddy_id = ? AND status = 'accepted'`;
    db.query(sql, [userId, buddyId], callback);
  },

  wasStreakAwardedToday: (userId, buddyId, callback) => {
    const sql = `
      SELECT id
      FROM buddies
      WHERE user_id = ? AND buddy_id = ? AND status = 'accepted' AND last_streak_awarded_on = CURDATE()`;
    db.query(sql, [userId, buddyId], callback);
  },

  updateStreak: (userId, buddyId, streak, callback) => {
    const sql = `
      UPDATE buddies
      SET streak = ?
      WHERE user_id = ? AND buddy_id = ? AND status = 'accepted'`;
    db.query(sql, [streak, userId, buddyId], callback);
  },

  removeConnection: (userId, buddyId, callback) => {
    const sql = `
      DELETE FROM buddies
      WHERE (user_id = ? AND buddy_id = ?) OR (user_id = ? AND buddy_id = ?)`;
    db.query(sql, [userId, buddyId, buddyId, userId], callback);
  },

  rejectRequest: (userId, buddyId, callback) => {
    const sql = `
      DELETE FROM buddies
      WHERE user_id = ? AND buddy_id = ? AND status = 'pending'`;
    db.query(sql, [userId, buddyId], callback);
  },
};

module.exports = Buddy;
