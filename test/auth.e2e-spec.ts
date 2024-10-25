import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserModule } from '../src/user/user.module';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let _userModel: Model<User>;

  const userService = {
    findAll: () => ['test user'],
    findById: (id: string) => ({ id, name: 'test user' }),
    update: (id: number, updateUserDto: any) => ({ id, ...updateUserDto }),
    remove: (_id: string) => ({ message: 'User deleted successfully' }),
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(userService.findAll()),
    constructor: jest.fn().mockResolvedValue(userService.findAll()),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getModelToken('User'))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const makeRequest = (method: string, url: string, body?: any) => {
    const req = request(app.getHttpServer())
      [method](url)
      .set('Authorization', 'Bearer test-token');
    if (body) {
      req.send(body);
    }
    return req;
  };

  it('/user (GET)', () => {
    return makeRequest('get', '/user')
      .expect(200)
      .expect(userService.findAll());
  });

  it('/user/:id (GET)', () => {
    return makeRequest('get', '/user/1')
      .expect(200)
      .expect(userService.findById('1'));
  });

  it('/user/:id (PATCH)', () => {
    const updateUserDto = { name: 'updated user' };
    return makeRequest('patch', '/user/1', updateUserDto)
      .expect(200)
      .expect(userService.update(1, updateUserDto));
  });

  it('/user/:id (DELETE)', () => {
    return makeRequest('delete', '/user/1')
      .expect(200)
      .expect({ message: 'User deleted successfully' });
  });
});
