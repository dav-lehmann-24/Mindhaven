const Buddy = require('../models/buddy');
const buddyChecklistNotifier = require('../observers/buddyChecklistNotifier');

const isAccepted = (record) => record && record.status === 'accepted';
const hasAcceptedConnection = (outgoingConnection, incomingConnection) =>
  isAccepted(outgoingConnection) || isAccepted(incomingConnection);
const normalizePair = (userId, buddyId) => [Math.min(userId, buddyId), Math.max(userId, buddyId)];
const sendDatabaseError = (res) => res.status(500).json({ message: 'Database error' });

const parseBuddyId = (req, res) => {
  const buddyId = Number(req.params.id);

  if (!Number.isInteger(buddyId)) {
    res.status(400).json({ message: 'A valid buddy id is required' });
    return null;
  }

  return buddyId;
};

const getAcceptedConnection = (userId, buddyId, callback) => {
  Buddy.findRequest(userId, buddyId, (outgoingErr, outgoingConnections) => {
    if (outgoingErr) return callback(outgoingErr);

    Buddy.findRequest(buddyId, userId, (incomingErr, incomingConnections) => {
      if (incomingErr) return callback(incomingErr);

      const outgoingConnection = outgoingConnections[0];
      const incomingConnection = incomingConnections[0];
      return callback(null, outgoingConnection, incomingConnection);
    });
  });
};

const getAnyConnection = (userId, buddyId, callback) => {
  getAcceptedConnection(userId, buddyId, (err, outgoingConnection, incomingConnection) => {
    if (err) return callback(err);
    return callback(null, outgoingConnection || incomingConnection);
  });
};

const withAcceptedChecklistConnection = (userId, buddyId, res, callback) => {
  getAcceptedConnection(userId, buddyId, (connectionErr, outgoingConnection, incomingConnection) => {
    if (connectionErr) return sendDatabaseError(res);
    if (!hasAcceptedConnection(outgoingConnection, incomingConnection)) {
      return res.status(400).json({ message: 'Checklist tasks require an accepted buddy connection' });
    }

    const [firstUserId, secondUserId] = normalizePair(userId, buddyId);
    return callback(firstUserId, secondUserId);
  });
};

exports.connectBuddy = (req, res) => {
  const userId = req.user.id;
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const buddyId = Number(req.body.buddyId);

  const startBuddyRequest = (buddy) => {
    const resolvedBuddyId = Number(buddy.id);
    if (resolvedBuddyId === userId) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    Buddy.findRequest(userId, resolvedBuddyId, (outgoingErr, outgoingConnections) => {
      if (outgoingErr) return sendDatabaseError(res);
      if (outgoingConnections.length > 0) {
        return res.status(400).json({
          message: `Buddy request already ${outgoingConnections[0].status}`,
        });
      }

      Buddy.findRequest(resolvedBuddyId, userId, (incomingErr, incomingConnections) => {
        if (incomingErr) return sendDatabaseError(res);
        if (incomingConnections.length > 0) {
          return res.status(400).json({
            message: `This buddy already sent you a ${incomingConnections[0].status} request`,
          });
        }

        Buddy.createRequest(userId, resolvedBuddyId, (createErr) => {
          if (createErr) return res.status(500).json({ message: 'Could not send buddy request' });

          return res.status(201).json({
            message: 'Buddy request sent successfully',
            status: 'pending',
            buddy,
          });
        });
      });
    });
  };

  if (username) {
    return Buddy.findUserByUsername(username, (userErr, users) => {
      if (userErr) return sendDatabaseError(res);
      if (users.length === 0) {
        return res.status(404).json({ message: 'Buddy not found' });
      }
      return startBuddyRequest(users[0]);
    });
  }

  if (!Number.isInteger(buddyId)) {
    return res.status(400).json({ message: 'A valid buddyId or username is required' });
  }

  return Buddy.findUserById(buddyId, (userErr, users) => {
    if (userErr) return sendDatabaseError(res);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Buddy not found' });
    }
    return startBuddyRequest(users[0]);
  });
};

exports.acceptBuddyRequest = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  if (buddyId === null) return;

  Buddy.findRequest(buddyId, userId, (requestErr, requests) => {
    if (requestErr) return sendDatabaseError(res);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'Buddy request not found' });
    }

    if (requests[0].status === 'accepted') {
      return res.status(400).json({ message: 'Buddy request already accepted' });
    }

    Buddy.acceptRequest(buddyId, userId, (acceptErr) => {
      if (acceptErr) return res.status(500).json({ message: 'Could not accept buddy request' });

      Buddy.findRequest(userId, buddyId, (reverseErr, reverseRequests) => {
        if (reverseErr) return res.status(500).json({ message: 'Database error' });

        if (reverseRequests.length > 0) {
          return Buddy.acceptRequest(userId, buddyId, (reverseAcceptErr) => {
            if (reverseAcceptErr) {
              return res.status(500).json({ message: 'Could not accept buddy request' });
            }

            return res.status(200).json({
              message: 'Buddy request accepted successfully',
              status: 'accepted',
            });
          });
        }

        return Buddy.createAcceptedConnection(userId, buddyId, requests[0].streak || 0, (createErr) => {
          if (createErr) {
            return res.status(500).json({ message: 'Could not accept buddy request' });
          }

          return res.status(200).json({
            message: 'Buddy request accepted successfully',
            status: 'accepted',
          });
        });
      });
    });
  });
};

exports.listPendingRequests = (req, res) => {
  Buddy.listPendingRequests(req.user.id, (err, requests) => {
    if (err) return res.status(500).json({ message: 'Error fetching pending requests' });
    return res.status(200).json(requests);
  });
};

exports.rejectBuddyRequest = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  if (buddyId === null) return;

  Buddy.findRequest(buddyId, userId, (requestErr, requests) => {
    if (requestErr) return sendDatabaseError(res);
    if (requests.length === 0 || requests[0].status !== 'pending') {
      return res.status(404).json({ message: 'Pending buddy request not found' });
    }

    Buddy.rejectRequest(userId, buddyId, (rejectErr) => {
      if (rejectErr) return res.status(500).json({ message: 'Could not reject buddy request' });

      return res.status(200).json({
        message: 'Buddy request rejected successfully',
        status: 'rejected',
      });
    });
  });
};

exports.listBuddies = (req, res) => {
  Buddy.listBuddies(req.user.id, (err, buddies) => {
    if (err) return res.status(500).json({ message: 'Error fetching buddies' });
    return res.status(200).json(buddies);
  });
};

exports.getBuddyTasks = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  if (buddyId === null) return;

  withAcceptedChecklistConnection(userId, buddyId, res, (firstUserId, secondUserId) => {
    Buddy.listChecklistTasks(firstUserId, secondUserId, userId, (taskErr, tasks) => {
      if (taskErr) return res.status(500).json({ message: 'Error fetching checklist tasks' });
      return res.status(200).json(tasks);
    });
  });
};

exports.addBuddyTask = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (buddyId === null) return;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  withAcceptedChecklistConnection(userId, buddyId, res, (firstUserId, secondUserId) => {
    Buddy.createChecklistTask(firstUserId, secondUserId, userId, title, (taskErr, result) => {
      if (taskErr) return res.status(500).json({ message: 'Could not create checklist task' });

      return res.status(201).json({
        message: 'Checklist task created successfully',
        task: {
          id: result.insertId,
          title,
          created_by: userId,
          completed_by_me: false,
          completed_by_buddy: false,
        },
      });
    });
  });
};

exports.toggleBuddyTask = (req, res) => {
  const userId = req.user.id;
  const buddyId = Number(req.params.id);
  const taskId = Number(req.params.taskId);
  const completed = Boolean(req.body.completed);

  if (!Number.isInteger(buddyId) || !Number.isInteger(taskId)) {
    return res.status(400).json({ message: 'Valid buddy id and task id are required' });
  }

  withAcceptedChecklistConnection(userId, buddyId, res, (firstUserId, secondUserId) => {
    Buddy.findChecklistTask(taskId, firstUserId, secondUserId, (taskErr, tasks) => {
      if (taskErr) return sendDatabaseError(res);
      if (tasks.length === 0) {
        return res.status(404).json({ message: 'Checklist task not found' });
      }

      const action = completed ? Buddy.markTaskCompleteForToday : Buddy.unmarkTaskCompleteForToday;
      action(taskId, userId, (toggleErr) => {
        if (toggleErr) return res.status(500).json({ message: 'Could not update checklist task' });

        const finalizeResponse = (streakAwarded) => {
          Buddy.listChecklistTasks(firstUserId, secondUserId, userId, (listErr, taskList) => {
            if (listErr) return res.status(500).json({ message: 'Error fetching checklist tasks' });

            return res.status(200).json({
              message: 'Checklist task updated successfully',
              streakAwarded,
              tasks: taskList,
            });
          });
        };

        return buddyChecklistNotifier.notifyTaskToggled({
          userId,
          buddyId,
          taskId,
          completed,
        }, (notifyErr, checklistEvent) => {
          if (notifyErr) return res.status(500).json({ message: 'Could not update streak from checklist' });
          return finalizeResponse(Boolean(checklistEvent.streakAwarded));
        });
      });
    });
  });
};

exports.getBuddyProfile = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  if (buddyId === null) return;

  getAnyConnection(userId, buddyId, (connectionErr, connection) => {
    if (connectionErr) return sendDatabaseError(res);
    if (!connection) {
      return res.status(404).json({ message: 'Buddy connection not found' });
    }

    Buddy.findUserById(buddyId, (userErr, users) => {
      if (userErr) return sendDatabaseError(res);
      if (users.length === 0) {
        return res.status(404).json({ message: 'Buddy not found' });
      }

      return res.status(200).json({
        ...users[0],
        streak: connection.streak,
        status: connection.status,
      });
    });
  });
};

exports.updateStreak = (req, res) => {
  return res.status(400).json({
    message: 'Wellness streaks are updated automatically from completed buddy checklist tasks',
  });
};

exports.removeBuddy = (req, res) => {
  const userId = req.user.id;
  const buddyId = parseBuddyId(req, res);
  if (buddyId === null) return;

  getAnyConnection(userId, buddyId, (connectionErr, connection) => {
    if (connectionErr) return sendDatabaseError(res);
    if (!connection) {
      return res.status(404).json({ message: 'Buddy connection not found' });
    }

    Buddy.removeConnection(userId, buddyId, (removeErr) => {
      if (removeErr) return res.status(500).json({ message: 'Could not remove buddy' });

      return res.status(200).json({ message: 'Buddy removed successfully' });
    });
  });
};
