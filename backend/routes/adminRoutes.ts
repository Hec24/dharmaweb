// backend/routes/adminRoutes.ts
import { Request, Response } from 'express';
import pool from '../database/db';
import fs from 'fs';
import path from 'path';

export async function runMigration(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running reservations migration...');

        const sql = fs.readFileSync(
            path.join(__dirname, '../database/reservations_schema.sql'),
            'utf-8'
        );

        await pool.query(sql);

        console.log('✅ Migration completed successfully');

        return res.json({
            success: true,
            message: 'Reservations table created successfully'
        });
    } catch (error: any) {
        console.error('❌ Migration error:', error);
        return res.status(500).json({
            error: 'Migration failed',
            details: error.message
        });
    }
}
