import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
@Entity('task_logs')
export class TaskLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36 })
  taskId: string;

  @Column('varchar', { length: 32, nullable: true })
  oldStatus?: string;

  @Column('varchar', { length: 32 })
  newStatus: string;

  @Column('varchar', { length: 16 })
  changedBy: 'Candidate' | 'System' | 'Recruiter';

  @Column('varchar', { nullable: true, length: 4000 })
  notes?: string;

  @CreateDateColumn()
  timestamp: Date;
}