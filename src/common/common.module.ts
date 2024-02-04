import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenizeService } from './services/tokenize.service';
import { UserService } from './services/user.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  providers: [ConfigModule, ConfigService, TokenizeService, UserService],
  exports: [
    JwtModule,
    ConfigModule,
    ConfigService,
    TokenizeService,
    UserService,
  ],
})
export class CommonModule {}
