import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserModule } from '../src/user/user.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { UserService } from '../src/user/user.service';
import { getModelToken } from '@nestjs/mongoose';
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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getModelToken('User'))
      .useValue({
        new: jest.fn().mockResolvedValue(userService.findAll()),
        constructor: jest.fn().mockResolvedValue(userService.findAll()),
        find: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect(userService.findAll());
  });

  it('/user/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/1')
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect(userService.findById('1'));
  });

  it('/user/:id (PATCH)', () => {
    const updateUserDto = { name: 'updated user' };
    return request(app.getHttpServer())
      .patch('/user/1')
      .set('Authorization', 'Bearer test-token')
      .send(updateUserDto)
      .expect(200)
      .expect(userService.update(1, updateUserDto));
  });

  it('/user/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/1')
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect({ message: 'User deleted successfully' });
  });
});
