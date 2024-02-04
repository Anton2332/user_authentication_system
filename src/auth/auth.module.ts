import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisModule } from '../redis/redis.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [RedisModule, CommonModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
