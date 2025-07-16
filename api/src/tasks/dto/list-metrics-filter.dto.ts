// projects/api/src/tasks/dto/create-task.dto.ts
export class CreateTaskDto {
  candidateEmail: string;
  recruiterEmail: string;
  description?: string;
  deadline?: Date;
}
export class ListMetricsFilterDto {
    startDate?: Date;
    endDate?: Date;
    recruiterEmail?: string;
    candidateEmail?: string;
    state?: 'Pending' | 'InProgress' | 'Error' | 'Clarification' | 'Completed';
    from?: Date;
    to?: Date;
    candidate?: string;
    recruiter?: string;
}