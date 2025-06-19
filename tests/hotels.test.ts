import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Hotel } from '../src/models/Hotel';
import { User } from '../src/models/User';

describe('Hotel API', () => {
  let token: string;
  let hotelId: string;

  const testUser = {
    email: 'hoteltester@example.com',
    password: 'Test1234',
    username: 'hoteltester',
    signupCode: 'TRAVEL123',
  };

  const hotelData = {
    name: 'Test Hotel',
    description: 'A lovely hotel',
    location: 'Test City',
    pricePerNight: 150,
    imageUrls: ['https://example.com/img1.jpg'],
  };

  beforeAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await Hotel.deleteMany({ title: hotelData.name });

    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    token = loginRes.body.token;
  });

  it('should create a new hotel (auth required)', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${token}`)
      .send(hotelData);
      console.log('CREATE HOTEL:', res.body); 

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(hotelData.name);


    hotelId = res.body._id;
  });

  it('should get all hotels', async () => {
    const res = await request(app).get('/api/hotels');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete a hotel (auth required)', async () => {
    const res = await request(app)
      .delete(`/api/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);
      console.log('DELETE HOTEL:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hotel deleted successfully');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
