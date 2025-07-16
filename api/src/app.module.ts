import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { TasksModule } from './tasks/tasks.module';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';


@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
      }
    }),
    PrometheusModule.register({ path: '/metrics', defaultMetrics: { enabled: true } }),   
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [__dirname + '/src/**/*.entity.{ts,js}'],
      migrations: [__dirname + '/src/migrations/*.{ts,js}'],
      autoLoadEntities: true,  
    }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
