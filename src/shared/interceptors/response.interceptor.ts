import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta: {
    statusCode: number;
    timestamp: string;
    path: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url } = request;

    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse();
        const { statusCode } = response;
        const now = Date.now();

        this.logger.log(
          `Outgoing Response: ${method} ${url} - ${statusCode} - ${now - now}ms`,
        );
      }),
    );
  }
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          `Response sent: ${request.method} ${request.url} - ${response.statusCode}`,
        );
        return {
          data,
          meta: {
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }),
    );
  }
}
