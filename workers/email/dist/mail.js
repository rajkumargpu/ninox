"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const email_module_1 = require("./email.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(email_module_1.EmailModule, {
        transport: microservices_1.Transport.RMQ,
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
