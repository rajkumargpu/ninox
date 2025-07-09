// projects/api/src/tasks/dto/create-task.dto.ts
export class CreateTaskDto {
  candidateEmail: string;
  recruiterEmail: string;
  description?: string;
  deadline?: Date;
}
