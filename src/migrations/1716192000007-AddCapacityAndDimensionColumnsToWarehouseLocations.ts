import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCapacityAndDimensionColumnsToWarehouseLocations1716192000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      {
        name: 'capacity_weight_kg',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      },
      {
        name: 'capacity_volume_cbm',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      },
      {
        name: 'dimension_length_cm',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      },
      {
        name: 'dimension_width_cm',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      },
      {
        name: 'dimension_height_cm',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      },
      {
        name: 'allow_mixed_items',
        type: 'boolean',
        isNullable: false,
        default: false,
      },
      {
        name: 'allow_mixed_lots',
        type: 'boolean',
        isNullable: false,
        default: false,
      },
      {
        name: 'allow_mixed_customers',
        type: 'boolean',
        isNullable: false,
        default: false,
      },
      {
        name: 'pick_sequence',
        type: 'integer',
        isNullable: true,
      },
      {
        name: 'putaway_sequence',
        type: 'integer',
        isNullable: true,
      },
      {
        name: 'custom_field1',
        type: 'varchar',
        isNullable: true,
      },
    ];

    for (const column of columns) {
      const hasColumn = await queryRunner.hasColumn('warehouse_locations', column.name);
      if (!hasColumn) {
        await queryRunner.addColumn('warehouse_locations', new TableColumn(column));
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      'capacity_weight_kg',
      'capacity_volume_cbm',
      'dimension_length_cm',
      'dimension_width_cm',
      'dimension_height_cm',
      'allow_mixed_items',
      'allow_mixed_lots',
      'allow_mixed_customers',
      'pick_sequence',
      'putaway_sequence',
      'custom_field1',
    ];

    for (const columnName of columns) {
      const hasColumn = await queryRunner.hasColumn('warehouse_locations', columnName);
      if (hasColumn) {
        await queryRunner.dropColumn('warehouse_locations', columnName);
      }
    }
  }
} 