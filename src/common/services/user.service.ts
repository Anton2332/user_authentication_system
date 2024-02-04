import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from '../../auth/consts/auth.consts';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    const saltRounds: string = this.configService.getOrThrow('SALT');
    bcrypt.genSalt(Number(saltRounds), (_, salt) => {
      bcrypt.hash(data.password, salt, (err, hash) => {
        if (err || hash === undefined) {
          throw new HttpException(
            ErrorMessages.USER_HASH_ARE_NOT_GENERATED,
            HttpStatus.BAD_REQUEST,
          );
        }
        data.password = hash;
      });
    });
    return this.prismaService.user.create({
      data,
    });
  }

  findUniqueUser({
    where,
    select,
  }: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }) {
    return this.prismaService.user.findUnique({ where, select });
  }
}
