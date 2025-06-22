import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

let token: string;
let hotelId: string;

beforeAll(async () => {
  const uniqueSuffix = Date.now();
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: `operator${uniqueSuffix}@test.com`,
      password: 'password',
      username: `operator${uniqueSuffix}`,
      signupCode: 'TRAVEL123',
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Hotel API', () => {
  it('should create a new hotel (auth required)', async () => {
    const hotelData = {
      name: 'Test Hotel',
      location: 'Test City',
      pricePerNight: 150,
    };

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
    expect(hotelId).toBeDefined();

    const res = await request(app)
      .delete(`/api/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('DELETE HOTEL:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hotel deleted successfully');
  });
});

describe('Hotel API - unauthorized user restrictions', () => {
  let userToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `user${Date.now()}@test.com`,
        password: 'password',
        username: `user${Date.now()}`
      });

    userToken = res.body.token;
  });

  it('should NOT allow a regular user to add a hotel', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Unauthorized Hotel',
        location: 'Nowhere',
        pricePerNight: 100,
      });

    expect(res.statusCode).toBe(403);
  });

  it('should NOT allow a regular user to delete a hotel', async () => {
    const res = await request(app)
      .delete('/api/hotels/someHotelId')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should NOT allow a regular user to update a hotel', async () => {
    const res = await request(app)
      .put('/api/hotels/someHotelId')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toBe(403);
  });
});