import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // load environment variables from .env file
  dotenv.config();
  const appService = app.get(AppService);
  await appService.init();
}
bootstrap();
