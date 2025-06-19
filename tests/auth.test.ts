import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

describe('Auth API', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test1234',
    username: 'testuser',
    signupCode: 'TRAVEL123',
  };

  let token: string;

  beforeAll(async () => {
    await User.deleteMany({
      $or: [{ email: testUser.email }, { username: testUser.username }]
    });
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    console.log('REGISTER:', response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should not allow duplicate registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    console.log('DUPLICATE:', response.body);
    expect(response.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    console.log('LOGIN:', response.body);
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

    console.log('FAIL LOGIN:', response.body);
    expect(response.statusCode).toBe(401);
  });
});
