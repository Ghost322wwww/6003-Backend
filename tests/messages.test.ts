import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';
import { Message } from '../src/models/Message';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

let token: string;
let userId: string;
let messageId: string;

beforeAll(async () => {
  // 這裡不要重複 connect，app.ts 已經做過了
  await User.deleteMany({});
  await Message.deleteMany({});

  const user = new User({
    username: 'testuser_msg',
    email: 'testuser_msg@example.com',
    password: 'hashedpassword',
    role: 'user',
  });
  await user.save();
  userId = user._id.toString();

  token = jwt.sign({ userId: user._id, role: 'user', _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Messages API', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello!', recipientId: userId });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Message sent successfully');
    expect(res.body.data).toHaveProperty('_id');

    messageId = res.body.data._id;
  });

  it('should get messages for user', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should delete a message', async () => {
    const res = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Message deleted successfully');
  });
});
