import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../src/tasks/tasks.entity';
import { TaskLog } from '../../src/tasks/task-log.entity';

describe('TasksService', () => {
  let service: TasksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: { save: jest.fn(), create: jest.fn() } },
        { provide: getRepositoryToken(TaskLog), useValue: { save: jest.fn() } },
        { provide: 'TASK_EVENTS', useValue: { emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve() }) } },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a task and emit event', async () => {
    const dto = { candidateEmail: 'a@b.com', recruiterEmail: 'r@c.com', description: '', deadline: new Date() };
    const task = await service.createTask(dto);
    expect(task).toHaveProperty('id');
  });
});