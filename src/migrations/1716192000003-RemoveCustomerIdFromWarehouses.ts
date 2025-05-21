// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class RemoveCustomerIdFromWarehouses1716192000003 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Drop the customer_id column from warehouses table
//     await queryRunner.dropColumn('warehouses', 'customer_id');
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Add back the customer_id column if we need to rollback
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