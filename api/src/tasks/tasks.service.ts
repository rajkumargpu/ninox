import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';

import { Task } from './tasks.entity';
import { TaskLog } from './task-log.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TaskMetricsDto } from './dto/task-metrics.dto';
import { TaskSummaryDto } from './dto/task-summary.dto';
import { ListMetricsFilterDto } from './dto/list-metrics-filter.dto';
import { AggregateFilterDto } from './dto/aggregate-filter.dto';
import { AggregateMetricsDto } from './dto/aggregate-metrics.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

export type TaskStatus = 'Pending' | 'InProgress' | 'Error' | 'Clarification' | 'Completed';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskLog)
    private readonly logRepo: Repository<TaskLog>,
    @Inject('TASK_EVENTS')
    private readonly client: ClientProxy,
    @InjectMetric('task_created_total')
    private readonly createCounter: Counter<string>,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      id: uuid(),
      candidateEmail: dto.candidateEmail,
      recruiterEmail: dto.recruiterEmail,
      description: dto.description,
      deadline: dto.deadline,
      status: 'Pending',
    });
    await this.taskRepo.save(task);

    await this.logRepo.save({
      taskId: task.id,
      newStatus: 'Pending',
      changedBy: 'System',
    });

    await this.client.emit('task.created', { taskId: task.id }).toPromise();
    return task;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    const { newStatus, note } = dto;
    if (!this.isValidTransition(task.status as TaskStatus, newStatus)) {
      throw new BadRequestException(`Invalid transition: ${task.status} → ${newStatus}`);
    }

    const oldStatus = task.status;
    task.status = newStatus;
    await this.taskRepo.save(task);

    await this.logRepo.save({
      taskId: id,
      oldStatus,
      newStatus,
      changedBy: 'Candidate',
      note,
    });

    await this.client.emit('status.updated', { taskId: id, newStatus, note }).toPromise();
    return task;
  }

  private isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
    const allowed: Record<TaskStatus, TaskStatus[]> = {
      'Pending': ['InProgress','Error','Clarification','Completed'],
      'InProgress': ['Error','Clarification','Completed'],
      'Error': ['InProgress','Clarification','Completed'],
      'Clarification': ['InProgress','Error','Completed'],
      'Completed': [],
    };
    return allowed[from].includes(to);
  }

  /* 1. Per-task metrics */
  async getTaskMetrics(id: string): Promise<TaskMetricsDto> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    const logs = await this.logRepo.find({ where: { taskId: id }, order: { timestamp: 'ASC' } });
    return { task, logs };
  }

  /* 2. Filtered list metrics */
  async listMetrics(filters: ListMetricsFilterDto): Promise<TaskSummaryDto[]> {
    const qb = this.taskRepo.createQueryBuilder('t');

    if (filters.state) qb.andWhere('t.status = :state', { state: filters.state });
    if (filters.from) qb.andWhere('t.createdAt >= :from', { from: filters.from });
    if (filters.to) qb.andWhere('t.createdAt <= :to', { to: filters.to });
    if (filters.candidate) qb.andWhere('t.candidateEmail = :candidate', { candidate: filters.candidate });
    if (filters.recruiter) qb.andWhere('t.recruiterEmail = :recruiter', { recruiter: filters.recruiter });

    const tasks = await qb.getMany();
    // Map to summary DTOs (could compute additional fields here)
    return tasks.map(t => ({
      id: t.id,
      candidateEmail: t.candidateEmail,
      recruiterEmail: t.recruiterEmail,
      description: t.description,
      deadline: t.deadline,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      durationSeconds: null,
      errorCount: 0,
      clarificationCount: 0,
      averageResolutionSeconds: 0,
    }));
  }

  /* 3. Aggregated KPIs */
  async aggregateMetrics(filters: AggregateFilterDto): Promise<AggregateMetricsDto> {
    const qb = this.taskRepo.createQueryBuilder('t')
      .select('COUNT(*)', 'totalTasks');

    if (filters.state) {
    qb.addSelect(
      'SUM(CASE WHEN t.status = :state THEN 1 ELSE 0 END)',
      'filteredTasks'
    ).setParameter('state', filters.state);
  }

  if (filters.from) {
    const fromDate = new Date(filters.from);   // JS Date
    qb.where('t.createdAt >= :fromDate', { fromDate });
  }

  if (filters.to) {
    const toDate = new Date(filters.to);       // JS Date
    qb.andWhere('t.createdAt <= :toDate', { toDate });
  }
    const raw = await qb.getRawOne();
    return {
      totalTasks: Number(raw.totalTasks),
      countsByState: {},
      averageCompletionSeconds: null,
      medianCompletionSeconds: null,
      totalErrors: 0,
      averageErrorCountPerTask: 0,
      averageClarificationCountPerTask: 0,
      percentCompletedWithinDeadline: null,
    };
  }
}