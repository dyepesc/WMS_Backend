// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class AddMissingColumnsToWarehouseLocations1716192000001 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`
//             ALTER TABLE warehouse_locations
//             ADD COLUMN IF NOT EXISTS created_by integer,
//             ADD COLUMN IF NOT EXISTS rack varchar,
//             ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
//             ADD COLUMN IF NOT EXISTS is_mixed_items_allowed boolean DEFAULT false,
//             ADD COLUMN IF NOT EXISTS is_mixed_customers_allowed boolean DEFAULT false,
//             ADD COLUMN IF NOT EXISTS is_mixed_tenants_allowed boolean DEFAULT false,
//             ADD COLUMN IF NOT EXISTS allow_mixed_items boolean DEFAULT true,
//             ADD COLUMN IF NOT EXISTS allow_mixed_lots boolean DEFAULT false,
//             ADD COLUMN IF NOT EXISTS allow_mixed_customers boolean DEFAULT true,
//             ADD COLUMN IF NOT EXISTS pick_sequence integer,
//             ADD COLUMN IF NOT EXISTS putaway_sequence integer,
//             ADD COLUMN IF NOT EXISTS custom_field1 varchar,
//             ADD COLUMN IF NOT EXISTS capacity_volume_cubic_meters decimal(10,2);
//         `);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`
//             ALTER TABLE warehouse_locations
//             DROP COLUMN IF EXISTS created_by,
//             DROP COLUMN IF EXISTS rack,
//             DROP COLUMN IF EXISTS is_active,
//             DROP COLUMN IF EXISTS is_mixed_items_allowed,
//             DROP COLUMN IF EXISTS is_mixed_customers_allowed,
//             DROP COLUMN IF EXISTS is_mixed_tenants_allowed,
//             DROP COLUMN IF EXISTS allow_mixed_items,
//             DROP COLUMN IF EXISTS allow_mixed_lots,
//             DROP COLUMN IF EXISTS allow_mixed_customers,
//             DROP COLUMN IF EXISTS pick_sequence,
//             DROP COLUMN IF EXISTS putaway_sequence,
//             DROP COLUMN IF EXISTS custom_field1,
//             DROP COLUMN IF EXISTS capacity_volume_cubic_meters;
//         `);
//     }
// }