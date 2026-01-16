import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request) {
      return true;
    }

    const expectedKey = this.configService.get('security.apiKey', {
      infer: true,
    });

    if (!expectedKey) {
      return true;
    }

    const headerKey =
      request.headers['x-api-key'] ||
      request.headers['X-API-KEY'] ||
      request.headers['authorization'];

    if (typeof headerKey !== 'string') {
      throw new UnauthorizedException('API key is missing');
    }

    const sanitizedKey = headerKey.startsWith('ApiKey ')
      ? headerKey.replace('ApiKey ', '')
      : headerKey;

    if (sanitizedKey !== expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
