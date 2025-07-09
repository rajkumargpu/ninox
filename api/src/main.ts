import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../data-source';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Data source has been initialized.');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
}

bootstrap();
