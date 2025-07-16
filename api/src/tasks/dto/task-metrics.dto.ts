import { Task } from '../tasks.entity';
import { TaskLog } from '../task-log.entity';

export interface TaskMetricsDto {
  task: Task;
  logs: TaskLog[];
}
