// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class UpdateWarehouseMeasurementStandardCheck1716192000005
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // First drop the existing constraint
//     await queryRunner.query(
//       `ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS warehouses_measurement_standard_check`,
//     );

//     // Update any existing rows to use 'metric' as default
//     await queryRunner.query(
//       `UPDATE warehouses SET measurement_standard = 'metric' WHERE measurement_standard NOT IN ('metric', 'imperial')`,
//     );

//     // Add the new constraint with both 'metric' and 'imperial' values
//     await queryRunner.query(
//       `ALTER TABLE warehouses ADD CONSTRAINT warehouses_measurement_standard_check CHECK (measurement_standard IN ('metric', 'imperial'))`,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Drop the new constraint
//     await queryRunner.query(
//       `ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS warehouses_measurement_standard_check`,
//     );

//     // Add back the old constraint (if it was different)
//     await queryRunner.query(
//       `ALTER TABLE warehouses ADD CONSTRAINT warehouses_measurement_standard_check CHECK (measurement_standard = 'metric')`,
//     );
//   }
// }
