import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  // Enable CORS for all origins (for development).
  // For production, you should restrict this to your frontend's domain.
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
