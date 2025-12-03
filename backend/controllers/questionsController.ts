// backend/controllers/questionsController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// GET /api/live-events/:eventId/questions - Get questions for an event
export const getEventQuestions = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId = (req as any).userId;

        const query = `
            SELECT 
                q.*,
                u.nombre as author_name,
                CASE 
                    WHEN v.id IS NOT NULL THEN true 
                    ELSE false 
                END as user_has_voted
            FROM event_questions q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN question_votes v ON q.id = v.question_id AND v.user_id = $1
            WHERE q.event_id = $2
            ORDER BY q.status = 'featured' DESC, q.votes DESC, q.created_at ASC
        `;

        const result = await pool.query(query, [userId, eventId]);

        return res.json(result.rows);
    } catch (error: any) {
        console.error('[QUESTIONS] Error fetching questions:', error);
        return res.status(500).json({ error: 'Error al obtener preguntas' });
    }
};

// POST /api/live-events/:eventId/questions - Submit a question
export const submitQuestion = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId = (req as any).userId;
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ error: 'La pregunta es requerida' });
        }

        if (question.length > 500) {
            return res.status(400).json({ error: 'La pregunta no puede exceder 500 caracteres' });
        }

        // Verify user has active membership
        const userResult = await pool.query(
            'SELECT membership_status FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows[0]?.membership_status !== 'active') {
            return res.status(403).json({ error: 'Requiere membresía activa' });
        }

        // Verify event exists and is upcoming
        const eventResult = await pool.query(
            'SELECT id FROM live_events WHERE id = $1 AND scheduled_at > NOW()',
            [eventId]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado o ya ha pasado' });
        }

        const result = await pool.query(`
            INSERT INTO event_questions (event_id, user_id, question)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [eventId, userId, question.trim()]);

        console.log('[QUESTIONS] Question submitted:', { eventId, userId });

        return res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('[QUESTIONS] Error submitting question:', error);
        return res.status(500).json({ error: 'Error al enviar pregunta' });
    }
};

// POST /api/live-events/questions/:id/vote - Vote on a question
export const voteQuestion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // Check if user already voted
        const existingVote = await pool.query(
            'SELECT id FROM question_votes WHERE question_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (existingVote.rows.length > 0) {
            // Unvote
            await pool.query(
                'DELETE FROM question_votes WHERE question_id = $1 AND user_id = $2',
                [id, userId]
            );

            await pool.query(
                'UPDATE event_questions SET votes = votes - 1 WHERE id = $1',
                [id]
            );

            console.log('[QUESTIONS] Vote removed:', { questionId: id, userId });

            return res.json({ voted: false, message: 'Voto eliminado' });
        } else {
            // Vote
            await pool.query(
                'INSERT INTO question_votes (question_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );

            await pool.query(
                'UPDATE event_questions SET votes = votes + 1 WHERE id = $1',
                [id]
            );

            console.log('[QUESTIONS] Vote added:', { questionId: id, userId });

            return res.json({ voted: true, message: 'Voto registrado' });
        }
    } catch (error: any) {
        console.error('[QUESTIONS] Error voting question:', error);
        return res.status(500).json({ error: 'Error al votar pregunta' });
    }
};
