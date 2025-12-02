// backend/controllers/videoController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// Obtener listado de vídeos con filtros y paginación
export async function getVideos(req: Request, res: Response) {
    try {
        const { area, search, limit = '20', offset = '0' } = req.query;
        const userId = (req as any).userId; // Del middleware de auth (opcional)

        let query = `
            SELECT v.*, 
                   vp.watched_seconds, 
                   vp.total_seconds, 
                   vp.is_completed,
                   vp.last_watched_at
            FROM videos v
            LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = $1
            WHERE v.is_published = true
        `;

        const params: any[] = [userId || null]; // $1 is user_id
        let paramCount = 1;

        if (area) {
            paramCount++;
            query += ` AND v.area = $${paramCount}`;
            params.push(area);
        }

        if (search) {
            paramCount++;
            query += ` AND (v.title ILIKE $${paramCount} OR v.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY v.upload_date DESC`;

        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(parseInt(limit as string));

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset as string));

        const result = await pool.query(query, params);

        // Contar total para paginación (simplificado)
        const countQuery = `SELECT COUNT(*) FROM videos WHERE is_published = true`;
        const countResult = await pool.query(countQuery);

        return res.json({
            videos: result.rows,
            total: parseInt(countResult.rows[0].count),
        });
    } catch (error) {
        console.error('[VIDEOS] Error getting videos:', error);
        return res.status(500).json({ error: 'Error al obtener los vídeos' });
    }
}

// Obtener detalle de un vídeo
export async function getVideoById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId; // Del middleware de auth (opcional)

        const query = `
            SELECT v.*, 
                   vp.watched_seconds, 
                   vp.total_seconds, 
                   vp.is_completed,
                   vp.last_watched_at
            FROM videos v
            LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = $1
            WHERE v.id = $2 AND v.is_published = true
        `;

        const result = await pool.query(query, [userId || null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vídeo no encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('[VIDEOS] Error getting video:', error);
        return res.status(500).json({ error: 'Error al obtener el vídeo' });
    }
}

// Guardar progreso
export async function saveProgress(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { watchedSeconds, totalSeconds, isCompleted } = req.body;
        const userId = (req as any).userId; // Del middleware authenticateToken

        console.log('[VIDEOS] Saving progress:', { userId, videoId: id, watchedSeconds, totalSeconds, isCompleted });

        if (!userId) {
            console.log('[VIDEOS] No userId found in request');
            return res.status(401).json({ error: 'No autorizado' });
        }

        // Upsert progreso
        const query = `
            INSERT INTO video_progress (user_id, video_id, watched_seconds, total_seconds, is_completed, last_watched_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_id, video_id) 
            DO UPDATE SET 
                watched_seconds = $3,
                total_seconds = $4,
                is_completed = $5,
                last_watched_at = NOW()
        `;

        await pool.query(query, [userId, id, watchedSeconds, totalSeconds, isCompleted]);

        console.log('[VIDEOS] Progress saved successfully');
        return res.json({ success: true });
    } catch (error) {
        console.error('[VIDEOS] Error saving progress:', error);
        return res.status(500).json({ error: 'Error al guardar el progreso' });
    }
}

// Obtener último vídeo visto
export async function getLastWatchedVideo(req: Request, res: Response) {
    try {
        const userId = (req as any).userId; // Del middleware authenticateToken

        if (!userId) {
            console.log('[VIDEOS] No userId in getLastWatchedVideo');
            return res.status(401).json({ error: 'No autorizado' });
        }

        console.log('[VIDEOS] Getting last watched video for user:', userId);

        const query = `
            SELECT v.*, 
                   vp.watched_seconds, 
                   vp.total_seconds, 
                   vp.is_completed,
                   vp.last_watched_at
            FROM video_progress vp
            INNER JOIN videos v ON v.id = vp.video_id
            WHERE vp.user_id = $1 
              AND v.is_published = true
              AND vp.is_completed = false
            ORDER BY vp.last_watched_at DESC
            LIMIT 1
        `;

        const result = await pool.query(query, [userId]);

        console.log('[VIDEOS] Last watched query result:', {
            rowCount: result.rows.length,
            video: result.rows[0] ? { id: result.rows[0].id, title: result.rows[0].title } : null
        });

        if (result.rows.length === 0) {
            return res.json(null);
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('[VIDEOS] Error getting last watched video:', error);
        return res.status(500).json({ error: 'Error al obtener el último vídeo' });
    }
}
