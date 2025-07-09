// projects/api/src/tasks/dto/update-status.dto.ts
export type TaskStatus = 'Pending' | 'InProgress' | 'Error' | 'Clarification' | 'Completed';

export class UpdateStatusDto {
  newStatus: TaskStatus;
  note?: string;
}
