import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CommonModule } from '../common/common.module';
import { RedisModule } from '../redis/redis.module';
import { Prisma } from '@prisma/client';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, RedisModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      const userPayload = {
        fullName: 'John',
        username: 'john14',
        password: 'password',
      };

      const user = await service.signUpUser(userPayload);

      expect(user).toMatchObject({
        fullName: userPayload.fullName,
        username: userPayload.username,
      });
    });

    it('should throw an error', async () => {
      const userPayload = {
        fullName: 'John',
        username: 'john6',
        password: 'password',
      };

      const signUp = service.signUpUser(userPayload);

      await expect(signUp).rejects.toBeInstanceOf(
        Prisma.PrismaClientKnownRequestError,
      );
    });
  });

  describe('signIn', () => {
    it('sign in and return token', async () => {
      const userPayload = {
        username: 'john1',
        password: 'password',
      };

      const user = await service.signInUser(userPayload);

      expect(user).toHaveProperty('token');
    });

    it('sign in with wrong usrname', async () => {
      const userPayload = {
        username: 'john111',
        password: 'password',
      };

      const findUser = service.signInUser(userPayload);

      await expect(findUser).rejects.toBeInstanceOf(HttpException);
    });

    it('sign in with wrong password', async () => {
      const userPayload = {
        username: 'john1',
        password: 'password11',
      };

      const findUser = service.signInUser(userPayload);

      await expect(findUser).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('findUser', () => {
    it('should return find user', async () => {
      const userPayload = {
        fullName: 'John',
        username: 'john1',
      };

      const user = await service.findUser({ username: userPayload.username });

      expect(user).toMatchObject(userPayload);
    });

    it('should throw an error', async () => {
      const userPayload = {
        username: 'john16',
      };

      const findUser = service.findUser(userPayload);

      await expect(findUser).rejects.toBeInstanceOf(HttpException);
    });
  });
});
