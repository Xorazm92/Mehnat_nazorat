import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode?: string,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class ValidationException extends BaseException {
  constructor(message: string, errors?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
    this.cause = errors;
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = 'Conflict') {
    super(message, HttpStatus.CONFLICT, 'CONFLICT');
  }
}
