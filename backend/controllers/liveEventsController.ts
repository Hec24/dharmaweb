import { Request, Response } from 'express';
import pool from '../database/db';

// Get upcoming events
export async function getUpcomingEvents(req: Request, res: Response) {
    try {
        const { area, search } = req.query;
        const userId = (req as any).userId; // From authenticateToken middleware

        let query = `
            SELECT 
                e.*,
                COUNT(DISTINCT r.id) as attendees_count,
                CASE 
                    WHEN ur.id IS NOT NULL THEN true 
                    ELSE false 
                END as is_registered
            FROM live_events e
            LEFT JOIN event_registrations r ON e.id = r.event_id
            LEFT JOIN event_registrations ur ON e.id = ur.event_id AND ur.user_id = $1
            WHERE e.is_published = true 
              AND e.scheduled_at > NOW()
        `;

        const params: any[] = [userId];

        if (area) {
            query += ` AND e.area = $${params.length + 1}`;
            params.push(area);
        }

        if (search) {
            query += ` AND (LOWER(e.title) LIKE $${params.length + 1} OR LOWER(e.description) LIKE $${params.length + 1})`;
            params.push(`%${(search as string).toLowerCase()}%`);
        }

        query += `
            GROUP BY e.id, ur.id
            ORDER BY e.scheduled_at ASC
        `;

        const result = await pool.query(query, params);

        return res.json(result.rows);
    } catch (error) {
        console.error('[LIVE_EVENTS] Error getting upcoming events:', error);
        return res.status(500).json({ error: 'Error al obtener eventos' });
    }
}

// Get past events with recordings
export async function getPastEvents(req: Request, res: Response) {
    try {
        const { area, search, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT 
                e.*,
                json_agg(
                    json_build_object(
                        'id', rec.id,
                        'video_provider', rec.video_provider,
                        'video_id', rec.video_id,
                        'duration_minutes', rec.duration_minutes
                    )
                ) FILTER (WHERE rec.id IS NOT NULL) as recordings
            FROM live_events e
            LEFT JOIN event_recordings rec ON e.id = rec.event_id
            WHERE e.is_published = true 
              AND e.scheduled_at < NOW()
        `;

        const params: any[] = [];
        let paramIndex = 1;

        if (area) {
            query += ` AND e.area = $${paramIndex}`;
            params.push(area);
            paramIndex++;
        }

        if (search) {
            query += ` AND (LOWER(e.title) LIKE $${paramIndex} OR LOWER(e.description) LIKE $${paramIndex})`;
            params.push(`%${(search as string).toLowerCase()}%`);
            paramIndex++;
        }

        query += `
            GROUP BY e.id
            ORDER BY e.scheduled_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        params.push(Number(limit), Number(offset));

        const result = await pool.query(query, params);

        return res.json(result.rows);
    } catch (error) {
        console.error('[LIVE_EVENTS] Error getting past events:', error);
        return res.status(500).json({ error: 'Error al obtener eventos pasados' });
    }
}

// Get event by ID
export async function getEventById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const userEmail = (req as any).userEmail;

        // Get event details
        const eventQuery = `
            SELECT 
                e.*,
                COUNT(DISTINCT r.id) as attendees_count,
                CASE 
                    WHEN ur.id IS NOT NULL THEN true 
                    ELSE false 
                END as is_registered
            FROM live_events e
            LEFT JOIN event_registrations r ON e.id = r.event_id
            LEFT JOIN event_registrations ur ON e.id = ur.event_id AND ur.user_id = $1
            WHERE e.id = $2 AND e.is_published = true
            GROUP BY e.id, ur.id
        `;

        const eventResult = await pool.query(eventQuery, [userId, id]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const event = eventResult.rows[0];

        // Get user's membership status
        const userQuery = `SELECT membership_status FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [userId]);
        const hasActiveMembership = userResult.rows[0]?.membership_status === 'active';

        // Only show Zoom link if user is registered and has active membership
        if (!event.is_registered || !hasActiveMembership) {
            event.zoom_link = null;
        }

        // Get recordings if event is past
        if (new Date(event.scheduled_at) < new Date()) {
            const recordingsQuery = `
                SELECT * FROM event_recordings WHERE event_id = $1
            `;
            const recordingsResult = await pool.query(recordingsQuery, [id]);
            event.recordings = recordingsResult.rows;
        }

        return res.json(event);
    } catch (error) {
        console.error('[LIVE_EVENTS] Error getting event:', error);
        return res.status(500).json({ error: 'Error al obtener evento' });
    }
}

// Register for event
export async function registerForEvent(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // Check if user has active membership
        const userQuery = `SELECT membership_status FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows[0]?.membership_status !== 'active') {
            return res.status(403).json({ error: 'Se requiere membresía activa para registrarse' });
        }

        // Check if event exists and is upcoming
        const eventQuery = `
            SELECT id, max_attendees, scheduled_at 
            FROM live_events 
            WHERE id = $1 AND is_published = true AND scheduled_at > NOW()
        `;
        const eventResult = await pool.query(eventQuery, [id]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado o ya ha pasado' });
        }

        const event = eventResult.rows[0];

        // Check if max attendees reached
        if (event.max_attendees) {
            const countQuery = `SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1`;
            const countResult = await pool.query(countQuery, [id]);

            if (parseInt(countResult.rows[0].count) >= event.max_attendees) {
                return res.status(400).json({ error: 'El evento ha alcanzado el máximo de asistentes' });
            }
        }

        // Register user
        const registerQuery = `
            INSERT INTO event_registrations (event_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (event_id, user_id) DO NOTHING
            RETURNING *
        `;

        const result = await pool.query(registerQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Ya estás registrado en este evento' });
        }

        console.log('[LIVE_EVENTS] User registered:', { userId, eventId: id });

        return res.json({ success: true, message: 'Registrado exitosamente' });
    } catch (error) {
        console.error('[LIVE_EVENTS] Error registering for event:', error);
        return res.status(500).json({ error: 'Error al registrarse' });
    }
}

// Unregister from event
export async function unregisterFromEvent(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // Check if event hasn't started yet
        const eventQuery = `SELECT scheduled_at FROM live_events WHERE id = $1`;
        const eventResult = await pool.query(eventQuery, [id]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (new Date(eventResult.rows[0].scheduled_at) < new Date()) {
            return res.status(400).json({ error: 'No puedes cancelar el registro de un evento que ya comenzó' });
        }

        // Unregister
        const deleteQuery = `
            DELETE FROM event_registrations 
            WHERE event_id = $1 AND user_id = $2
            RETURNING *
        `;

        const result = await pool.query(deleteQuery, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'No estás registrado en este evento' });
        }

        console.log('[LIVE_EVENTS] User unregistered:', { userId, eventId: id });

        return res.json({ success: true, message: 'Registro cancelado' });
    } catch (error) {
        console.error('[LIVE_EVENTS] Error unregistering from event:', error);
        return res.status(500).json({ error: 'Error al cancelar registro' });
    }
}

// Get user's registrations
export async function getMyRegistrations(req: Request, res: Response) {
    try {
        const userId = (req as any).userId;

        const query = `
            SELECT 
                e.*,
                r.registered_at,
                COUNT(DISTINCT r2.id) as attendees_count
            FROM event_registrations r
            INNER JOIN live_events e ON r.event_id = e.id
            LEFT JOIN event_registrations r2 ON e.id = r2.event_id
            WHERE r.user_id = $1 
              AND e.is_published = true
              AND e.scheduled_at > NOW()
            GROUP BY e.id, r.registered_at
            ORDER BY e.scheduled_at ASC
        `;

        const result = await pool.query(query, [userId]);

        return res.json(result.rows);
    } catch (error) {
        console.error('[LIVE_EVENTS] Error getting user registrations:', error);
        return res.status(500).json({ error: 'Error al obtener tus registros' });
    }
}
