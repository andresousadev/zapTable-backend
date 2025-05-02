import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from './domain/errors/base.exception';

@Catch() // Catch all exceptions
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpException: HttpException;
    let statusCode: number;

    if (exception instanceof BaseException) {
      statusCode = exception.statusCode;
      httpException = new HttpException(exception.message, statusCode);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      httpException = exception;
    } else {
      // Default case: convert to Internal Server Error (500)
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      httpException = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const errorResponse = {
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: httpException.message,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${statusCode} - Message: ${JSON.stringify(httpException.message)}`,
      exception.stack,
    );

    response.status(statusCode).json(errorResponse);
  }
}
