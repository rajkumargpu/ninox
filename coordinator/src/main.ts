// projects/coordinator/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'task.events',
        queueOptions: { durable: true },
        exchange: 'task.events',
        exchangeType: 'topic',
        routingKey: '#',
      },
    },
  );
  app.useLogger(app.get(Logger));
  await app.listen();
}
bootstrap();
