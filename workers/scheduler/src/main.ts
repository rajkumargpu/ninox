import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
const app = await NestFactory.createApplicationContext(SchedulerModule);
console.log('⏰ Scheduler Worker started, polling every 5 minutes');
}
bootstrap();