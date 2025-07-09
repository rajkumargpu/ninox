// projects/api/src/tasks/tasks.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { TaskLog } from './task-log.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';

type TaskStatus = 'Pending' | 'InProgress' | 'Error' | 'Clarification' | 'Completed';

@Injectable()
    export class TasksService {
  constructor(
    @InjectRepository(Task)                     // ← tell Nest “here’s the Task repo”
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskLog)                     // ← tell Nest “here’s the Task repo”
    private readonly logRepo: Repository<TaskLog>,

    @Inject('TASK_EVENTS')                       // your RMQ client
    private readonly client: ClientProxy,
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

    await this.events.emit('task.created', { taskId: task.id }).toPromise();
    return task;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    const { newStatus, note } = dto;
    const status = task.status;
    if (!this.isValidTransition(status, newStatus)) {
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

    await this.events.emit('status.updated', { taskId: id, newStatus, note }).toPromise();
    return task;
  }

  private isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
    const allowed: Record<TaskStatus, TaskStatus[]> = {
      Pending: ['InProgress', 'Error', 'Clarification', 'Completed'],
      InProgress: ['Error', 'Clarification', 'Completed'],
      Error: ['InProgress', 'Clarification', 'Completed'],
      Clarification: ['InProgress', 'Error', 'Completed'],
      Completed: [],
    };
    return allowed[from].includes(to);
  }

  // Metrics methods (GET /tasks/:id/metrics, etc.) go here...
}
