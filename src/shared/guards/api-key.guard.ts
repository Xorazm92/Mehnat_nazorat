import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    return apiKey && apiKey === validApiKey;
  }
}
