jest.mock('../../models/buddy', () => ({
  findUserById: jest.fn(),
  findRequest: jest.fn(),
  createRequest: jest.fn(),
  acceptRequest: jest.fn(),
  createAcceptedConnection: jest.fn(),
  listPendingRequests: jest.fn(),
  listBuddies: jest.fn(),
  listChecklistTasks: jest.fn(),
  createChecklistTask: jest.fn(),
  findChecklistTask: jest.fn(),
  markTaskCompleteForToday: jest.fn(),
  unmarkTaskCompleteForToday: jest.fn(),
  countChecklistTasks: jest.fn(),
  countTasksCompletedByBothToday: jest.fn(),
  incrementStreakForPair: jest.fn(),
  wasStreakAwardedToday: jest.fn(),
  updateStreak: jest.fn(),
  removeConnection: jest.fn(),
  rejectRequest: jest.fn(),
}));

const Buddy = require('../../models/buddy');
const buddyController = require('../../controllers/buddyController');

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('Buddy Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('connectBuddy creates a pending buddy request', () => {
    const req = {
      user: { id: 1 },
      body: { buddyId: 2 },
    };
    const res = createRes();

    Buddy.findUserById.mockImplementation((buddyId, callback) => {
      callback(null, [{ id: 2, username: 'buddy-user' }]);
    });
    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, []))
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, []));
    Buddy.createRequest.mockImplementation((userId, buddyId, callback) => {
      callback(null, { affectedRows: 1 });
    });

    buddyController.connectBuddy(req, res);

    expect(Buddy.createRequest).toHaveBeenCalledWith(1, 2, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Buddy request sent successfully',
      status: 'pending',
      buddy: { id: 2, username: 'buddy-user' },
    });
  });

  test('acceptBuddyRequest accepts an incoming request and creates the reverse accepted connection', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
    };
    const res = createRes();

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, [{ id: 10, user_id: 2, buddy_id: 1, streak: 3, status: 'pending' }]);
      })
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, []);
      });
    Buddy.acceptRequest.mockImplementation((userId, buddyId, callback) => {
      callback(null, { affectedRows: 1 });
    });
    Buddy.createAcceptedConnection.mockImplementation((userId, buddyId, streak, callback) => {
      callback(null, { affectedRows: 1 });
    });

    buddyController.acceptBuddyRequest(req, res);

    expect(Buddy.acceptRequest).toHaveBeenCalledWith(2, 1, expect.any(Function));
    expect(Buddy.createAcceptedConnection).toHaveBeenCalledWith(1, 2, 3, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Buddy request accepted successfully',
      status: 'accepted',
    });
  });

  test('listPendingRequests returns pending requests separately from accepted buddies', () => {
    const req = { user: { id: 1 } };
    const res = createRes();
    const requests = [
      { profile_id: 2, username: 'buddy-user', status: 'pending', direction: 'incoming' },
      { profile_id: 3, username: 'new-friend', status: 'pending', direction: 'outgoing' },
    ];

    Buddy.listPendingRequests.mockImplementation((userId, callback) => {
      callback(null, requests);
    });

    buddyController.listPendingRequests(req, res);

    expect(Buddy.listPendingRequests).toHaveBeenCalledWith(1, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(requests);
  });

  test('rejectBuddyRequest deletes an incoming pending request', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
    };
    const res = createRes();

    Buddy.findRequest.mockImplementation((userId, buddyId, callback) => {
      callback(null, [{ id: 22, user_id: 2, buddy_id: 1, status: 'pending' }]);
    });
    Buddy.rejectRequest.mockImplementation((userId, buddyId, callback) => {
      callback(null, { affectedRows: 1 });
    });

    buddyController.rejectBuddyRequest(req, res);

    expect(Buddy.rejectRequest).toHaveBeenCalledWith(1, 2, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Buddy request rejected successfully',
      status: 'rejected',
    });
  });

  test('listBuddies returns only accepted buddies', () => {
    const req = { user: { id: 1 } };
    const res = createRes();
    const buddies = [
      { profile_id: 3, username: 'close-friend', status: 'accepted', direction: 'outgoing' },
      { profile_id: 4, username: 'workout-pal', status: 'accepted', direction: 'incoming' },
    ];

    Buddy.listBuddies.mockImplementation((userId, callback) => {
      callback(null, buddies);
    });

    buddyController.listBuddies(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(buddies);
  });

  test('getBuddyTasks returns checklist tasks for an accepted buddy connection', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
    };
    const res = createRes();
    const tasks = [{ id: 5, title: 'Drink water', completed_by_me: false, completed_by_buddy: true }];

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]))
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]));
    Buddy.listChecklistTasks.mockImplementation((firstUserId, secondUserId, currentUserId, callback) => {
      callback(null, tasks);
    });

    buddyController.getBuddyTasks(req, res);

    expect(Buddy.listChecklistTasks).toHaveBeenCalledWith(1, 2, 1, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  test('addBuddyTask creates a checklist item for an accepted buddy connection', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
      body: { title: 'Meditate for 10 minutes' },
    };
    const res = createRes();

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]))
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]));
    Buddy.createChecklistTask.mockImplementation((firstUserId, secondUserId, createdBy, title, callback) => {
      callback(null, { insertId: 12 });
    });

    buddyController.addBuddyTask(req, res);

    expect(Buddy.createChecklistTask).toHaveBeenCalledWith(1, 2, 1, 'Meditate for 10 minutes', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Checklist task created successfully',
      task: {
        id: 12,
        title: 'Meditate for 10 minutes',
        created_by: 1,
        completed_by_me: false,
        completed_by_buddy: false,
      },
    });
  });

  test('toggleBuddyTask awards a streak point when both buddies complete all tasks for today', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2', taskId: '5' },
      body: { completed: true },
    };
    const res = createRes();
    const updatedTasks = [{ id: 5, title: 'Walk', completed_by_me: true, completed_by_buddy: true }];

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]))
      .mockImplementationOnce((userId, buddyId, callback) => callback(null, [{ status: 'accepted' }]));
    Buddy.findChecklistTask.mockImplementation((taskId, firstUserId, secondUserId, callback) => {
      callback(null, [{ id: 5, title: 'Walk' }]);
    });
    Buddy.markTaskCompleteForToday.mockImplementation((taskId, userId, callback) => {
      callback(null, { affectedRows: 1 });
    });
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
    Buddy.listChecklistTasks.mockImplementation((firstUserId, secondUserId, currentUserId, callback) => {
      callback(null, updatedTasks);
    });

    buddyController.toggleBuddyTask(req, res);

    expect(Buddy.markTaskCompleteForToday).toHaveBeenCalledWith(5, 1, expect.any(Function));
    expect(Buddy.incrementStreakForPair).toHaveBeenNthCalledWith(1, 1, 2, expect.any(Function));
    expect(Buddy.incrementStreakForPair).toHaveBeenNthCalledWith(2, 2, 1, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Checklist task updated successfully',
      streakAwarded: true,
      tasks: updatedTasks,
    });
  });

  test('getBuddyProfile returns the buddy profile with relationship status', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
    };
    const res = createRes();

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, [{ id: 99, streak: 7, status: 'accepted' }]);
      })
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, []);
      });
    Buddy.findUserById.mockImplementation((buddyId, callback) => {
      callback(null, [{ id: 2, username: 'buddy-user', country: 'DE' }]);
    });

    buddyController.getBuddyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 2,
      username: 'buddy-user',
      country: 'DE',
      streak: 7,
      status: 'accepted',
    });
  });

  test('updateStreak only updates accepted buddy relationships', () => {
    const req = { user: { id: 1 }, body: { buddyId: 2, streak: 4 } };
    const res = createRes();

    buddyController.updateStreak(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Wellness streaks are updated automatically from completed buddy checklist tasks',
    });
  });

  test('removeBuddy deletes pending or accepted relationships from both sides', () => {
    const req = {
      user: { id: 1 },
      params: { id: '2' },
    };
    const res = createRes();

    Buddy.findRequest
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, [{ id: 88, streak: 4, status: 'pending' }]);
      })
      .mockImplementationOnce((userId, buddyId, callback) => {
        callback(null, []);
      });
    Buddy.removeConnection.mockImplementation((userId, buddyId, callback) => {
      callback(null, { affectedRows: 1 });
    });

    buddyController.removeBuddy(req, res);

    expect(Buddy.removeConnection).toHaveBeenCalledWith(1, 2, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Buddy removed successfully' });
  });
});
