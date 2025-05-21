// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class UpdateWarehousesTable1716192000003 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Drop the customer_id column
//     await queryRunner.dropColumn('warehouses', 'customer_id');
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Add back the customer_id column
//     await queryRunner.addColumn(
//       'warehouses',
//       new TableColumn({
//         name: 'customer_id',
//         type: 'int',
//         isNullable: true,
//       }),
//     );
//   }
// }