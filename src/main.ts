import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  await app.listen(PORT);
}
bootstrap();
