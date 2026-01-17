import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT || '8008', 10);
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
