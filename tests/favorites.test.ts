import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Hotel } from '../src/models/Hotel';
import { User } from '../src/models/User';
import { Favorite } from '../src/models/Favorite';

describe('Favorites API', () => {
  let token: string;
  let hotelId: string;
  let userId: string;

  const testUser = {
    email: 'favoriteuser@example.com',
    password: 'Test1234',
    username: 'favoriteuser',
    signupCode: 'TRAVEL123',
  };

  const hotelData = {
    name: 'Favorite Hotel',
    title: 'Favorite Hotel',
    description: 'A great hotel for testing',
    location: 'Testville',
    pricePerNight: 199,
    imageUrls: ['https://example.com/hotel.jpg'],
  };

  beforeAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await Hotel.deleteMany({ name: hotelData.name });
    await Favorite.deleteMany({});

    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    token = loginRes.body.token;

    const userRes = await User.findOne({ email: testUser.email });
    userId = userRes?._id.toString();

    const hotelRes = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${token}`)
      .send(hotelData);

    hotelId = hotelRes.body._id;
  });

  it('should add a hotel to favorites', async () => {
    const res = await request(app)
      .post(`/api/favorites/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hotel added to favorites');
  });

  it('should list user favorites', async () => {
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]._id).toBe(hotelId);
  });

  it('should remove a hotel from favorites', async () => {
    const res = await request(app)
      .delete(`/api/favorites/${hotelId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hotel removed from favorites');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
