import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://todo-nextxjs-nestjs.vercel.app', // your actual Vercel domain
    ],
  });
  await app.listen(3001);
}
bootstrap();
