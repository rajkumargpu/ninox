// projects/api/src/tasks/dto/task-summary.dto.ts

export interface TaskSummaryDto {
  id: string;
  candidateEmail: string;
  recruiterEmail: string;
  description: string;
  deadline: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
