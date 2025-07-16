import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';

interface EmailJob {
to: string;
subject: string;
template: string;
context: any;
}

@Injectable()
export class EmailService {
private readonly logger = new Logger(EmailService.name);
constructor(
  @InjectMetric('email_send_duration_seconds')
  private readonly sendHist: Histogram<string>,
) {}
@EventPattern('notification.email')
async handleEmailJob(@Payload() job: EmailJob, @Ctx() context: RmqContext) {
const channel = context.getChannelRef();
const message = context.getMessage();
try {
} catch (err) {
  this.logger.error(`Failed to send email to ${job.to}`, err);
  // Negative acknowledgment to trigger DLX routing
  channel.nack(message, false, false);
}
}
}