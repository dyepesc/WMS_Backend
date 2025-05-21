// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class AddCreatedByToWarehouses1716192000004 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // First add the column as nullable
//     await queryRunner.addColumn(
//       'warehouses',
//       new TableColumn({
//         name: 'created_by',
//         type: 'int',
//         isNullable: true,
//       }),
//     );

//     // Update existing records with a default value (e.g., 1 for system user)
//     await queryRunner.query(`UPDATE warehouses SET created_by = 1 WHERE created_by IS NULL`);

//     // Then modify the column to be NOT NULL
//     await queryRunner.changeColumn(
//       'warehouses',
//       'created_by',
//       new TableColumn({
//         name: 'created_by',
//         type: 'int',
//         isNullable: false,
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('warehouses', 'created_by');
//   }
// } 