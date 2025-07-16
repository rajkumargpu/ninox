import { Module } from '@nestjs/common';
import { RmqModule } from '@api/rmq';
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
deadLetterExchange: 'notification.dlx',
deadLetterRoutingKey: 'email.failed',
},
}),
],
providers: [EmailService],
})
export class EmailModule {}