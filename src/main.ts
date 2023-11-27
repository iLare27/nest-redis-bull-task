import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from "@nestjs/common";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const port = process.env.APP_PORT;

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
bootstrap();
