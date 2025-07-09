import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport, ClientProviderOptions } from '@nestjs/microservices';

export interface RmqOptions {
name: string;                 // Injection token for the client
queue: string;                // Queue name to bind
exchange: string;             // Exchange name
exchangeType?: 'topic'|'direct'|'fanout';
routingKey?: string;          // Default routing key when publishing
queueOptions?: Record<string, any>;  // Additional queueOptions (e.g., deadLetterExchange)
}

@Module({})
export class RmqModule {
static register(options: RmqOptions): DynamicModule {
const clientOptions: ClientProviderOptions = {
name: options.name,
transport: Transport.RMQ,
options: {
urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
queue: options.queue,
exchange: options.exchange,
exchangeType: options.exchangeType || 'direct',
routingKey: options.routingKey || options.queue,
queueOptions: {
durable: true,
...options.queueOptions,
},
},
};

return {
  module: RmqModule,
  imports: [ClientsModule.register([clientOptions])],
  exports: [ClientsModule],
};

}
}

// Usage example in any module (e.g., AppModule or a dedicated messaging module):
//
// @Module({
//   imports: [
//     RmqModule.register({
//       name: 'TASK_EVENTS',
//       queue: 'task.events',
//       exchange: 'task.events',
//       exchangeType: 'topic',
//     }),
//     RmqModule.register({
//       name: 'EMAIL_NOTIFICATIONS',
//       queue: 'notification.email',
//       exchange: 'notification',
//       exchangeType: 'direct',
//       queueOptions: {
//         deadLetterExchange: 'notification.dlx',
//         deadLetterRoutingKey: 'email.failed',
//       },
//     }),
//   ],
// })
// export class MessagingModule {}