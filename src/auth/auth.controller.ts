import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDTO } from './dtos/signup-user.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { AllExceptionsFilter } from '../common/filters/all-exception.filter';
import { SignInUserDTO } from './dtos/signin-user.dto';
import { User } from '../common/decorators/user.decorator';
import { IJWTPayload } from '../common/types';
import { JWTAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
@UseFilters(AllExceptionsFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUpUser(@Body() user: SignUpUserDTO) {
    const createdUser = await this.authService.signUpUser(user);
    return { message: 'User created', user: createdUser };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signInUser(@Body() user: SignInUserDTO) {
    const result = await this.authService.signInUser(user);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  async getInfo(@User() user: IJWTPayload) {
    return this.authService.findUser(user);
  }
}
