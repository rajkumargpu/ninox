// projects/coordinator/src/app.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';
import { RmqModule } from '../../api/src/rmq/rmq.module';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    LoggerModule.forRoot({ pinoHttp: { level: 'info' } }),
    PrometheusModule.register({ path: '/metrics', defaultMetrics: { enabled: true } }),
    RmqModule.register({
      
      name: 'TASK_EVENTS',
      queue: 'task.events',
      exchange: 'task.events',
      exchangeType: 'topic',
      routingKey: '#',
    }),

    // 2) Email notifications client
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
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class AppModule {}
