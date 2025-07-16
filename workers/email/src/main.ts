import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmailModule } from './email.module';

async function bootstrap() {
const app = await NestFactory.createMicroservice(EmailModule, {
transport: Transport.RMQ,
options: {
urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
queue: 'notification.email',
queueOptions: { durable: true, deadLetterExchange: 'notification.dlx', deadLetterRoutingKey: 'email.failed' },
exchange: 'notification',
exchangeType: 'direct',
routingKey: 'notification.email',
},
});
await app.listen();
console.log('📧 Email Worker listening on notification.email queue');
}
bootstrap();