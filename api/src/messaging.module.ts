import { Module } from '@nestjs/common';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    RmqModule.register({
      name: 'TASK_EVENTS',           
      queue: 'task.events',          
      exchange: 'task.events',       
      exchangeType: 'topic',
      routingKey: '#',               
    }),
  ],
  exports: [],
})
export class MessagingModule {}
