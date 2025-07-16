import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RmqModule } from '../rmq/rmq.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { TasksController } from './tasks.controller';
import { TasksService }    from './tasks.service';
import { Task }            from './tasks.entity';
import { TaskLog }         from './task-log.entity';

@Module({
  imports: [
    // 1) TypeORM repositories
    TypeOrmModule.forFeature([Task, TaskLog]),

    // 2) RMQ client for domain events
    RmqModule.register({
      name: 'TASK_EVENTS',
      queue: 'task.events',
      exchange: 'task.events',
      exchangeType: 'topic',
      routingKey: '#',
      queueOptions: { durable: true },
    }),

    // 3) Prometheus for @InjectMetric(...)
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  controllers: [TasksController],
  providers:    [TasksService],
  exports:      [TasksService],
})
export class TasksModule {}
