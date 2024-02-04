import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';
import { RedisModule } from '../redis/redis.module';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, RedisModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('sign in and return token', async () => {
      const userPayload = {
        username: 'Anton',
        password: '123456fF*',
      };

      const user = await controller.signInUser(userPayload);

      expect(user).toHaveProperty('token');
    });

    it('sign in with wrong username', async () => {
      const userPayload = {
        username: 'john111',
        password: 'password',
      };

      const findUser = controller.signInUser(userPayload);

      await expect(findUser).rejects.toBeInstanceOf(HttpException);
    });

    it('sign in with wrong password', async () => {
      const userPayload = {
        username: 'john1',
        password: 'password11',
      };

      const findUser = controller.signInUser(userPayload);

      await expect(findUser).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('getInfo', () => {
    it('find user by username', async () => {
      const userPayload = {
        id: '1',
        fullName: 'John',
        username: 'john1',
        password: 'password',
      };

      const user = await controller.getInfo(userPayload);

      expect(user).toMatchObject({
        username: userPayload.username,
        fullName: userPayload.fullName,
      });
    });

    it('find user by username', async () => {
      const userPayload = {
        id: '1',
        fullName: 'John',
        username: 'john11111',
        password: 'password',
      };

      const user = controller.getInfo(userPayload);

      await expect(user).rejects.toBeInstanceOf(HttpException);
    });
  });
});
