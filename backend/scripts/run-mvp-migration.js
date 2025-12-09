// Script to run MVP migration
// Run with: node scripts/run-mvp-migration.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const migrationPath = path.join(__dirname, '../database/migrations/add_mvp_and_membership_tracking.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running MVP migration...');
        await pool.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
