import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksAndLogsTables1752099779438 implements MigrationInterface {
    name = 'CreateTasksAndLogsTables1752099779438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" varchar2(36) NOT NULL, "candidateEmail" varchar2(255) NOT NULL, "recruiterEmail" varchar2(255) NOT NULL, "description" clob, "deadline" TIMESTAMP WITH TIME ZONE, "status" varchar2(32) DEFAULT 'Pending' NOT NULL, "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_logs" ("id" number GENERATED BY DEFAULT AS IDENTITY, "taskId" varchar2(36) NOT NULL, "oldStatus" varchar2(32), "newStatus" varchar2(32) NOT NULL, "changedBy" varchar2(16) NOT NULL, "note" varchar2(4000), "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_9754457a29b4ffbb772e8a3039c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_logs"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
