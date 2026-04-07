const request = require('supertest');

jest.mock('../../models/auth', () => ({
  create: (username, email, password, bio, profile_picture, country, gender, cb) => {
    cb(null, { insertId: 1 });
  },
  findByEmail: (email, cb) => {
    cb(null, [{
      id: 1,
      username: 'test',
      email,
      password: '$2a$10$fakehashedpassword'
    }]);
  }
}));

const app = require('../../index');

describe('Auth Integration Test', () => {

  test('POST /api/auth/register responds', async () => {

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: "integrationUser",
        email: "integration@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);

  });

});