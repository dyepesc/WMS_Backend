import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecreateWarehouseLocationsTable1716192000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the existing table
        await queryRunner.query(`DROP TABLE IF EXISTS warehouse_locations CASCADE;`);

        // Then create the table with all required columns
        await queryRunner.query(`
            CREATE TABLE warehouse_locations (
                id SERIAL PRIMARY KEY,
                tenant_id integer NOT NULL,
                warehouse_id integer NOT NULL,
                zone_id integer NOT NULL,
                created_by integer,
                location_barcode varchar NOT NULL,
                aisle varchar,
                rack varchar,
                level varchar,
                position varchar,
                capacity_weight_kg decimal(10,2),
                capacity_volume_cubic_meters decimal(10,2),
                is_active boolean DEFAULT true,
                is_mixed_items_allowed boolean DEFAULT false,
                is_mixed_customers_allowed boolean DEFAULT false,
                is_mixed_tenants_allowed boolean DEFAULT false,
                status varchar,
                allow_mixed_items boolean DEFAULT true,
                allow_mixed_lots boolean DEFAULT false,
                allow_mixed_customers boolean DEFAULT true,
                pick_sequence integer,
                putaway_sequence integer,
                custom_field1 varchar,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_warehouse_locations_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
                CONSTRAINT fk_warehouse_locations_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
                CONSTRAINT fk_warehouse_locations_zone FOREIGN KEY (zone_id) REFERENCES warehouse_zones(id),
                CONSTRAINT fk_warehouse_locations_created_by FOREIGN KEY (created_by) REFERENCES users(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS warehouse_locations CASCADE;`);
    }
}