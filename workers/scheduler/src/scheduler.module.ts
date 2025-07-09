import { Module } from '@nestjs/common';
import { RmqModule } from '../../../api/src/rmq/rmq.module';
import { SchedulerService } from './scheduler.service
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
  providers: [SchedulerService],
})
export class SchedulerModule {}
