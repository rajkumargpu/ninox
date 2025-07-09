import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [__dirname + '/src/**/*.entity.{ts,js}'],
      migrations: [__dirname + '/src/migrations/*.{ts,js}'],
    }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
