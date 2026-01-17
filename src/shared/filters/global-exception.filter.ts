import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
  details?: any;
}

export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errorCode = (exceptionResponse as any).errorCode || 'HTTP_EXCEPTION';
        details = (exceptionResponse as any).details;
      } else {
        message = exceptionResponse as string;
        errorCode = 'HTTP_EXCEPTION';
      }
      status = exception.getStatus();
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'UNKNOWN_ERROR';
      details = exception.stack;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errorCode,
      ...(details && { details }),
    };

    // Log error details
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
