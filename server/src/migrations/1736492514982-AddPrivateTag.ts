import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrivateTag1736492514982 implements MigrationInterface {
    name = 'AddPrivateTag1736492514982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "isPrivate"`);
    }

}
