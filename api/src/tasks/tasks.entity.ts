import 'reflect-metadata';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;                       // UUID

  @Column('varchar', { length: 255 })
  candidateEmail: string;

  @Column('varchar', { length: 255 })
  recruiterEmail: string;

  @Column('clob', { nullable: true})
  description?: string;

  @Column('timestamp with time zone', { nullable: true })
  deadline?: Date;

  @Column('varchar', { length: 32, default: 'Pending' })
  status: 'Pending' | 'InProgress' | 'Completed' | 'Clarification' | 'Error';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
