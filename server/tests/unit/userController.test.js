jest.mock('../../config/database', () => ({
  query: (sql, params, callback) => {
    callback(null, [{
      id: 1,
      username: "testuser",
      email: "test@test.com"
    }]);
  }
}));

const userController = require('../../controllers/userController');

describe('User Controller', () => {

  test('getProfile returns response', () => {

    const req = {
      user: { id: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    userController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

  });

});