import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoordinatorService } from './coordinator.service';

@Controller()
export class CoordinatorController {
  private readonly logger = new Logger(CoordinatorController.name);

  constructor(private readonly coord: CoordinatorService) {}

  @EventPattern('task.created')
  async onCreated(@Payload() data: any) {
    this.logger.log(`task.created → enqueue email to candidate`);
    await this.coord.handleTaskCreated(data);
  }

  @EventPattern('status.updated')
  async onStatus(@Payload() data: any) {
    this.logger.log(`status.updated (${data.newStatus}) → enqueue accordingly`);
    await this.coord.handleStatusUpdated(data);
  }

  @EventPattern('deadline.passed')
  async onDeadline(@Payload() data: any) {
    this.logger.log(`deadline.passed → enqueue reminders`);
    await this.coord.handleDeadline(data);
  }
}
