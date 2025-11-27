// backend/database/migrate_reservations.ts
import pool from './db';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function migrateReservations() {
    try {
        console.log('📦 Creating reservations table...');

        const sql = fs.readFileSync(
            path.join(__dirname, 'reservations_schema.sql'),
            'utf-8'
        );

        await pool.query(sql);

        console.log('✅ Reservations table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating reservations table:', error);
        process.exit(1);
    }
}

migrateReservations();
