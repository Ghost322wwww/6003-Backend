import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

const testUser = {
  email: 'testuser@example.com',
  password: 'Test1234',
  username: 'testuser',
  signupCode: 'TRAVEL123',
};

describe('Auth API', () => {
  beforeAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await request(app).post('/api/auth/register').send(testUser);
  });

  it('should not allow duplicate registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(response.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongPassword',
      });

    expect(response.statusCode).toBe(401);
  });
});
