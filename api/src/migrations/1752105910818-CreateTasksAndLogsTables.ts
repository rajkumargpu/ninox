import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksAndLogsTables1752105910818 implements MigrationInterface {
    name = 'CreateTasksAndLogsTables1752105910818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_logs" RENAME COLUMN "note" TO "notes"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_logs" RENAME COLUMN "notes" TO "note"`);
    }

}
