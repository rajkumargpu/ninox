import { Module } from '@nestjs/common';
import { RmqModule } from '../../api/src/rmq/rmq.module';

@Module({
  imports: [
    // Listen to domain events
    RmqModule.register({
      name: 'TASK_EVENTS',
      queue: 'task.events',
      exchange: 'task.events',
      exchangeType: 'topic',
      routingKey: '#',
    }),
    // Publish email notifications
    RmqModule.register({
      name: 'EMAIL_NOTIFICATIONS',
      queue: 'notification.email',
      exchange: 'notification',
      exchangeType: 'direct',
      routingKey: 'notification.email',
      queueOptions: {
        deadLetterExchange: 'notification.dlx',
        deadLetterRoutingKey: 'email.failed',
      },
    }),
  ],
})
export class MessagingModule {}
