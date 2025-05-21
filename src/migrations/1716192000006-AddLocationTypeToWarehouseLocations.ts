// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class AddLocationTypeToWarehouseLocations1716192000006 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.addColumn(
//       'warehouse_locations',
//       new TableColumn({
//         name: 'location_type',
//         type: 'varchar',
//         isNullable: false,
//         default: "'Bin'"
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('warehouse_locations', 'location_type');
//   }
// } 