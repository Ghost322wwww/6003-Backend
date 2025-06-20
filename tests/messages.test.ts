import request from 'supertest';
import app from '../src/app';

const testUser = {
  email: 'msguser@example.com',
  username: 'msguser',
  password: 'msgpassword123',
  signupCode: 'TRAVEL123',
};

let token: string;
let userId: string;
let messageId: string;
let hotelId: string;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send(testUser);

  const loginRes = await request(app).post('/api/auth/login').send({
    email: testUser.email,
    password: testUser.password,
  });

  if (!loginRes.body.token) {
    console.error('Unable to obtain token:', loginRes.body);
    throw new Error('Login failed');
  }

  token = loginRes.body.token;
  userId = loginRes.body.user?._id || loginRes.body.user?.id;
  console.log('🔐 token:', token);
  console.log('👤 userId:', userId);

  const hotelRes = await request(app)
    .post('/api/hotels')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Hotel for Messaging',
      location: 'Test City',
      pricePerNight: 100,
    });

  console.log('🏨 hotelRes.body:', hotelRes.body);

  hotelId = hotelRes.body.data?._id || hotelRes.body._id;

  if (!hotelId) throw new Error('Failed to retrieve hotelId');
  console.log('🏨 hotelId:', hotelId);
});

describe('Messages API', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hotelId,
        message: 'This is a test message for the hotel',
      });

    console.log('📨 SEND response:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Message sent successfully');
    expect(res.body.data).toHaveProperty('_id');

    messageId = res.body.data._id;
  });

  it('should get messages for user', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`);

    console.log('GET response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should delete a message', async () => {
    expect(messageId).toBeDefined();

    const res = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('DELETE response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Message deleted successfully');
  });
});
