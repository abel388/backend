import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const frontend = process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const app = await NestFactory.create(AppModule, { cors: { origin: frontend } });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

