import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../types';
import { TokenDTO } from '../dtos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenizeService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: IJWTPayload): Promise<TokenDTO | null> {
    try {
      const accessToken = this.jwtService.sign(payload, {
        privateKey: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '1d',
      });

      return { token: accessToken };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  verifyToken<T extends object>(token: string) {
    try {
      return this.jwtService.verify<T>(token);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
