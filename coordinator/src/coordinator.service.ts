import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class CoordinatorService {
  constructor(
    @Inject('EMAIL_NOTIFICATIONS')
    private readonly emailClient: ClientProxy,
    @InjectMetric('notification_enqueued_total')
    private readonly notifCounter: Counter<string>,
  ) {}

  async handleTaskCreated({ taskId, candidateEmail }): Promise<void> {
    await this.emailClient.emit('notification.email', {
      to: candidateEmail,
      subject: 'New coding challenge assigned',
      template: 'task-created',
      context: { taskId },
    }).toPromise();
  }

  async handleStatusUpdated({ taskId, newStatus, note }): Promise<void> {
    // build subject/body based on newStatus...
    const payload = { taskId, status: newStatus, note };
    await this.emailClient.emit('notification.email', {
      to: 'test.raj@yopmail.com',
      subject: `Task ${taskId} status: ${newStatus}`,
      template: 'status-updated',
      context: payload,
    }).toPromise();
  }

  async handleDeadline({ taskId, candidateEmail, recruiterEmail }): Promise<void> {
    // send two reminders
    for (const to of [candidateEmail, recruiterEmail]) {
      await this.emailClient.emit('notification.email', {
        to,
        subject: `Task ${taskId} deadline passed`,
        template: 'deadline-passed',
        context: { taskId },
      }).toPromise();
    }
  }
}
