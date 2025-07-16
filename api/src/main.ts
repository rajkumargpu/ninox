import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../data-source';
import { Logger } from 'nestjs-pino';

async function bootstrap() {

  const app = await NestFactory.create(AppModule,  { bufferLogs: true });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useLogger(app.get(Logger));
  try {
    
    await AppDataSource.initialize();
    app.get(Logger).log('Data source has been initialized.');
    console.log('Data source has been initialized.');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }


  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
}

bootstrap();
