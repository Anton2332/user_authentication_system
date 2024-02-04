import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpUserDTO } from './dtos/signup-user.dto';
import { UserService } from '../common/services/user.service';
import { ErrorMessages } from './consts/auth.consts';
import { SignInUserDTO } from './dtos/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { TokenizeService } from '../common/services/tokenize.service';
import { RedisService } from '../redis/redis.service';
import { exclude } from '../common/utils/exclude.helper';
import { IUser } from './types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenizeService: TokenizeService,
    private readonly redisService: RedisService,
  ) {}

  async signUpUser(userInfo: SignUpUserDTO) {
    const createdUser = await this.userService.createUser(userInfo);
    this.redisService.set(
      createdUser.username,
      JSON.stringify(createdUser),
      60,
    );
    return exclude(createdUser, ['password']);
  }

  async signInUser(userCredentials: SignInUserDTO) {
    let findUser: null | IUser = null;
    const findString = await this.redisService.get(userCredentials.username);
    if (findString) {
      findUser = JSON.parse(findString);
    }

    if (!findUser) {
      findUser = await this.userService.findUniqueUser({
        where: {
          username: userCredentials.username,
        },
      });
    }

    if (!findUser) {
      throw new HttpException(
        ErrorMessages.WRONG_USERNAME_OR_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!findString) {
      this.redisService.set(findUser.username, JSON.stringify(findUser), 60);
    }

    const isValidPassword = await bcrypt.compare(
      userCredentials.password,
      findUser.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        ErrorMessages.WRONG_USERNAME_OR_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessToken = await this.tokenizeService.generateAccessToken({
      id: findUser.id,
      username: findUser.username,
    });
    return accessToken;
  }

  async findUser({ username }: { username: string }) {
    let findUser: null | IUser = null;
    const findString = await this.redisService.get(username);
    if (findString) {
      findUser = JSON.parse(findString);
    }
    if (!findUser) {
      findUser = await this.userService.findUniqueUser({
        where: {
          username,
        },
      });
    }
    if (!findUser) {
      throw new HttpException(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!findString) {
      this.redisService.set(findUser.username, JSON.stringify(findUser), 60);
    }
    return exclude(findUser, ['password']);
  }
}
