import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

interface OverdueTaskDto {
taskId: string;
candidateEmail: string;
recruiterEmail: string;
deadline: string;
}

@Injectable()
export class SchedulerService {
private readonly logger = new Logger(SchedulerService.name);

constructor(
private readonly http: HttpService,
@Inject('TASK_EVENTS')
private readonly eventsClient: ClientProxy,
) {}

@Cron(CronExpression.EVERY_5_MINUTES)
async handleCron() {
this.logger.log('Checking for overdue tasks via API...');
try {
const response = await firstValueFrom(
this.http.get<OverdueTaskDto[]>('http://localhost:3000/api/tasks/overdue')
);
const overdue = response.data;
const now = new Date();
for (const task of overdue) {
this.logger.log(`Task ${task.taskId} overdue, emitting deadline.passed`);
await this.eventsClient.emit('deadline.passed', {
taskId: task.taskId,
candidateEmail: task.candidateEmail,
recruiterEmail: task.recruiterEmail,
}).toPromise();
}
} catch (err) {
this.logger.error('Failed to fetch overdue tasks', err);
}
}
}