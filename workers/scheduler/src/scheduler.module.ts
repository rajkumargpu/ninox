import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { RmqModule } from '@api/rmq';
import { SchedulerService } from './scheduler.service';

@Module({
imports: [
ScheduleModule.forRoot(),
HttpModule,
RmqModule.register({
name: 'TASK_EVENTS',
queue: 'task.events',
exchange: 'task.events',
exchangeType: 'topic',
routingKey: 'deadline.passed',
}),
],
providers: [SchedulerService],
})
export class SchedulerModule {}