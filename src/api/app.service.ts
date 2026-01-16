import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config';

export class Application {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService<AppConfig>>(ConfigService);
    const port = configService.get('app.port', { infer: true }) ?? 3000;
    await app.listen(port);
  }
}
