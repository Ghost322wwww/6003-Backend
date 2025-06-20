import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {User} from '../src/models/User';
import {Hotel} from '../src/models/Hotel';
import {Favorite} from '../src/models/Favorite';

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

let token: string;
let userId: string;
let hotelId: string;
let favoriteId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || '', {
    dbName: 'test_fav',
  });

  const user = new User({
    username: `testuser_${Date.now()}`,
    name: 'Favorite Tester',
    email: `fav_${Date.now()}@example.com`,
    password: '12345678',
    role: 'user',
  });
  await user.save();
  userId = user._id.toString();

  token = jwt.sign({ _id: userId, role: user.role }, JWT_SECRET);

  const hotel = new Hotel({
    name: 'Test Hotel',
    location: 'Test City',
    pricePerNight: 100,
  });
  await hotel.save();
  hotelId = hotel._id.toString();
});

afterAll(async () => {
  await Favorite.deleteMany({});
  await Hotel.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('Favorites API', () => {
  it('should allow a user to add a hotel to favorites', async () => {
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ hotelId });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Hotel added to favorites');
    favoriteId = res.body.favorite._id;
  });

  it('should allow a user to get their favorite hotels', async () => {
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should allow a user to remove a hotel from favorites', async () => {
    const res = await request(app)
      .delete(`/api/favorites/${favoriteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hotel removed from favorites');
  });
});
