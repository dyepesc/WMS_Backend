import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToCarriers1716192000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "carriers"
      ADD COLUMN "created_by" integer NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "carriers"
      DROP COLUMN "created_by";
    `);
  }
}