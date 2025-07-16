// projects/api/src/tasks/tasks.controller.ts
import { Controller, Post, Body, Patch, Param, Get, Query} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Task } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, dto);
  }

  // (Metrics endpoints omitted here — see service for implementations)
  
  // at the bottom of tasks.controller.ts

/** 1. Per‐task metrics */
@Get(':id/metrics')
async getMetrics(@Param('id') id: string) {
  return this.tasksService.getTaskMetrics(id);
}

/** 2. Filtered list of per‐task metrics */
@Get('metrics')
async listMetrics(
  @Query('state') state?: string,
  @Query('from') from?: string,
  @Query('to') to?: string,
  @Query('candidate') candidate?: string,
  @Query('recruiter') recruiter?: string,
) {
  const allowedStates = ['Pending', 'InProgress', 'Error', 'Clarification', 'Completed'] as const;
  const typedState = allowedStates.includes(state as any) ? state as typeof allowedStates[number] : undefined;
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  return this.tasksService.listMetrics({ state: typedState, from: fromDate, to: toDate, candidate, recruiter });
}

/** 3. Aggregated KPIs */
@Get('metrics/aggregate')
async aggregateMetrics(
  @Query('state') state?: string,
  @Query('from') from?: string,
  @Query('to') to?: string,
) {
  return this.tasksService.aggregateMetrics({ state, from, to });
}

}
