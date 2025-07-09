import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';

@Module({
  imports: [
    // Register Task entity repository
    TypeOrmModule.forFeature([Task]),
    // Register RabbitMQ client for task events
    ClientsModule.register([
      {
        name: 'TASK_EVENTS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:15672'],
          queue: 'task_events_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
