import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove non-whitelisted properties
    forbidNonWhitelisted: true, // throw errors for non-whitelisted properties
    transform: true, // automatically transform payloads to DTO instances
  }));
  await app.listen(3000);
}
bootstrap();