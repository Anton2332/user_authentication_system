import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TokenizeService } from '../services/tokenize.service';
import { IJWTPayload } from '../types';

/**
 * @param  {JWTAuthGuard} This guard checks user token and verify him
 */

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly baseAuthService: TokenizeService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const accessToken = request?.headers?.authorization ?? null;
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const [, token] = accessToken.split(' ');
      if (!token) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }
      const user = this.baseAuthService.verifyToken<IJWTPayload>(token);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      request.user = user;
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
