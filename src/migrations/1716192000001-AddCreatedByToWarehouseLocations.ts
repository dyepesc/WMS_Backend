import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToWarehouseLocations1716192000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE warehouse_locations
            ADD COLUMN created_by integer;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE warehouse_locations
            DROP COLUMN created_by;
        `);
    }
}