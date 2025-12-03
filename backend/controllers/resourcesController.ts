// backend/controllers/resourcesController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// GET /api/community/resources - Get all resources (with optional area filter)
export const getResources = async (req: Request, res: Response) => {
    try {
        const { area } = req.query;

        let query = `
            SELECT 
                r.*,
                u.nombre as created_by_name
            FROM community_resources r
            LEFT JOIN users u ON r.created_by_user_id = u.id
        `;

        const params: any[] = [];

        if (area) {
            query += ' WHERE r.area = $1';
            params.push(area);
        }

        query += `
            ORDER BY r.is_featured DESC, r.created_at DESC
        `;

        const result = await pool.query(query, params);

        return res.json(result.rows);
    } catch (error: any) {
        console.error('[RESOURCES] Error fetching resources:', error);
        return res.status(500).json({ error: 'Error al obtener recursos' });
    }
};

// GET /api/community/resources/featured - Get only featured resources
export const getFeaturedResources = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                r.*,
                u.nombre as created_by_name
            FROM community_resources r
            LEFT JOIN users u ON r.created_by_user_id = u.id
            WHERE r.is_featured = true
            ORDER BY r.created_at DESC
        `;

        const result = await pool.query(query);

        return res.json(result.rows);
    } catch (error: any) {
        console.error('[RESOURCES] Error fetching featured resources:', error);
        return res.status(500).json({ error: 'Error al obtener recursos destacados' });
    }
};

// GET /api/community/resources/:id - Get single resource
export const getResourceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                r.*,
                u.nombre as created_by_name
            FROM community_resources r
            LEFT JOIN users u ON r.created_by_user_id = u.id
            WHERE r.id = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recurso no encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (error: any) {
        console.error('[RESOURCES] Error fetching resource:', error);
        return res.status(500).json({ error: 'Error al obtener recurso' });
    }
};
