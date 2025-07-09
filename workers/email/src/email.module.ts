import { Module } from '@nestjs/common';
import { RmqModule } from '../../../api/src/rmq/rmq.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    RmqModule.register({
      name: 'EMAIL_NOTIFICATIONS',
      queue: 'notification.email',
      exchange: 'notification',
      exchangeType: 'direct',
      routingKey: 'notification.email',
      queueOptions: {
        durable: true,
        deadLetterExchange: 'notification.dlx',
        deadLetterRoutingKey: 'email.failed',
      },
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
``