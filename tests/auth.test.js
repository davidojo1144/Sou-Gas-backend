const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const User = require('../src/models/User');

let mongoServer;

// Increase timeout for downloading MongoDB binaries
jest.setTimeout(30000);

// Connect to a test database before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clear the database after each test
afterEach(async () => {
  await User.deleteMany();
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth Endpoints', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'customer'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register a user with existing email', async () => {
      await User.create({
        fullName: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'customer'
        });
      
      expect(res.statusCode).toEqual(400); // Mongoose duplicate key error mapped to 400
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        fullName: 'Login User',
        email: 'login@example.com',
        password: 'password123',
        role: 'customer'
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const user = await User.create({
        fullName: 'Me User',
        email: 'me@example.com',
        password: 'password123',
        role: 'customer'
      });
      token = user.getSignedJwtToken();
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('email', 'me@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('Password Reset Flow', () => {
    let user;
    
    beforeEach(async () => {
      user = await User.create({
        fullName: 'Reset User',
        email: 'reset@example.com',
        password: 'oldpassword',
        role: 'customer'
      });
    });

    it('should send reset email', async () => {
      const res = await request(app)
        .post('/api/auth/forgotpassword')
        .send({ email: 'reset@example.com' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBe('Email sent');
      
      // Check if code was saved to user
      const updatedUser = await User.findOne({ email: 'reset@example.com' });
      expect(updatedUser.verificationCode).toBeDefined();
    });

    it('should reset password with valid code', async () => {
      // Manually set code
      user.verificationCode = '1234';
      user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      const res = await request(app)
        .put('/api/auth/resetpassword')
        .send({
          email: 'reset@example.com',
          code: '1234',
          password: 'newpassword123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');

      // Verify new password works
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'reset@example.com',
          password: 'newpassword123'
        });
      
      expect(loginRes.statusCode).toEqual(200);
    });
  });
});
