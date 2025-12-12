// backend/scripts/initializeUserLevels.ts
// Script to initialize level data for existing users who don't have it

import pool from '../database/db';

async function initializeUserLevels() {
    try {
        console.log('[MIGRATION] Starting user level initialization...');

        // Update all users who don't have level data
        const result = await pool.query(`
            UPDATE users
            SET 
                current_level = 1,
                total_xp = 0,
                daily_xp = 0
            WHERE current_level IS NULL OR total_xp IS NULL
            RETURNING id, email, nombre
        `);

        console.log(`[MIGRATION] Initialized level data for ${result.rowCount} users`);

        if (result.rows.length > 0) {
            console.log('[MIGRATION] Updated users:');
            result.rows.forEach(user => {
                console.log(`  - ${user.email} (${user.nombre})`);
            });
        }

        console.log('[MIGRATION] Migration completed successfully!');
    } catch (error) {
        console.error('[MIGRATION] Error initializing user levels:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the migration
initializeUserLevels()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
