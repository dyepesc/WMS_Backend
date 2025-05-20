import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToWarehouseZones1716192000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE warehouse_zones
            ADD COLUMN created_by integer;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE warehouse_zones
            DROP COLUMN created_by;
        `);
    }
}