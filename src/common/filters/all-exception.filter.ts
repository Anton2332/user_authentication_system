import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ErrorMessages } from '../../auth/consts/auth.consts';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let errorMessage: string | undefined;

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { status, message } = this.catchPrismaErrors(exception);
      httpStatus = status;
      errorMessage = message;
    }
    const responseBody = {
      statusCode: httpStatus,
      errorMessage: errorMessage ?? exception,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  catchPrismaErrors(exception: Prisma.PrismaClientKnownRequestError): {
    status: HttpStatus;
    message: string;
  } {
    if (exception.code === 'P2002') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: ErrorMessages.USER_ALREADY_EXIST,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
    };
  }
}
