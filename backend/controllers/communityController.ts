// backend/controllers/communityController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// GET /api/community/posts - Obtener posts (con filtro opcional por área)
export const getPosts = async (req: Request, res: Response) => {
    try {
        const { area } = req.query;

        let query = `
            SELECT 
                p.id,
                p.area,
                p.title,
                p.content,
                p.is_pinned,
                p.created_at,
                p.updated_at,
                u.nombre as author_name,
                u.id as author_id,
                COUNT(DISTINCT c.id) as comments_count
            FROM community_posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN community_comments c ON p.id = c.post_id
        `;

        const params: any[] = [];

        if (area) {
            query += ' WHERE p.area = $1';
            params.push(area);
        }

        query += `
            GROUP BY p.id, u.nombre, u.id
            ORDER BY p.is_pinned DESC, p.created_at DESC
        `;

        const result = await pool.query(query, params);

        return res.json(result.rows);
    } catch (error: any) {
        console.error('[COMMUNITY] Error fetching posts:', error);
        return res.status(500).json({ error: 'Error al obtener posts' });
    }
};

// GET /api/community/posts/:id - Obtener un post específico con comentarios
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Obtener el post
        const postResult = await pool.query(`
            SELECT 
                p.id,
                p.area,
                p.title,
                p.content,
                p.is_pinned,
                p.created_at,
                p.updated_at,
                u.nombre as author_name,
                u.id as author_id
            FROM community_posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [id]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Obtener los comentarios
        const commentsResult = await pool.query(`
            SELECT 
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
                u.nombre as author_name,
                u.id as author_id
            FROM community_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `, [id]);

        const post = {
            ...postResult.rows[0],
            comments: commentsResult.rows
        };

        return res.json(post);
    } catch (error: any) {
        console.error('[COMMUNITY] Error fetching post:', error);
        return res.status(500).json({ error: 'Error al obtener el post' });
    }
};

// POST /api/community/posts - Crear nuevo post
export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { area, title, content } = req.body;

        if (!area || !title || !content) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Verificar que el usuario tiene membresía activa
        const userResult = await pool.query(
            'SELECT membership_status FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0 || userResult.rows[0].membership_status !== 'active') {
            return res.status(403).json({ error: 'Requiere membresía activa' });
        }

        const result = await pool.query(`
            INSERT INTO community_posts (user_id, area, title, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [userId, area, title, content]);

        return res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('[COMMUNITY] Error creating post:', error);
        return res.status(500).json({ error: 'Error al crear el post' });
    }
};

// PUT /api/community/posts/:id - Editar post propio
export const updatePost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Verificar que el post pertenece al usuario
        const checkResult = await pool.query(
            'SELECT user_id FROM community_posts WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para editar este post' });
        }

        const result = await pool.query(`
            UPDATE community_posts
            SET title = $1, content = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [title, content, id]);

        return res.json(result.rows[0]);
    } catch (error: any) {
        console.error('[COMMUNITY] Error updating post:', error);
        return res.status(500).json({ error: 'Error al actualizar el post' });
    }
};

// DELETE /api/community/posts/:id - Eliminar post propio
export const deletePost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        // Verificar que el post pertenece al usuario
        const checkResult = await pool.query(
            'SELECT user_id FROM community_posts WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
        }

        await pool.query('DELETE FROM community_posts WHERE id = $1', [id]);

        return res.json({ message: 'Post eliminado correctamente' });
    } catch (error: any) {
        console.error('[COMMUNITY] Error deleting post:', error);
        return res.status(500).json({ error: 'Error al eliminar el post' });
    }
};

// POST /api/community/posts/:id/comments - Crear comentario
export const createComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id: postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'El contenido es requerido' });
        }

        // Verificar que el usuario tiene membresía activa
        const userResult = await pool.query(
            'SELECT membership_status FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0 || userResult.rows[0].membership_status !== 'active') {
            return res.status(403).json({ error: 'Requiere membresía activa' });
        }

        // Verificar que el post existe
        const postCheck = await pool.query(
            'SELECT id FROM community_posts WHERE id = $1',
            [postId]
        );

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        const result = await pool.query(`
            INSERT INTO community_comments (post_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [postId, userId, content]);

        // Obtener el nombre del autor para la respuesta
        const commentWithAuthor = await pool.query(`
            SELECT 
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
                u.nombre as author_name,
                u.id as author_id
            FROM community_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = $1
        `, [result.rows[0].id]);

        return res.status(201).json(commentWithAuthor.rows[0]);
    } catch (error: any) {
        console.error('[COMMUNITY] Error creating comment:', error);
        return res.status(500).json({ error: 'Error al crear el comentario' });
    }
};

// PUT /api/community/comments/:id - Editar comentario propio
export const updateComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'El contenido es requerido' });
        }

        // Verificar que el comentario pertenece al usuario
        const checkResult = await pool.query(
            'SELECT user_id FROM community_comments WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para editar este comentario' });
        }

        const result = await pool.query(`
            UPDATE community_comments
            SET content = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `, [content, id]);

        return res.json(result.rows[0]);
    } catch (error: any) {
        console.error('[COMMUNITY] Error updating comment:', error);
        return res.status(500).json({ error: 'Error al actualizar el comentario' });
    }
};

// DELETE /api/community/comments/:id - Eliminar comentario propio
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        // Verificar que el comentario pertenece al usuario
        const checkResult = await pool.query(
            'SELECT user_id FROM community_comments WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
        }

        await pool.query('DELETE FROM community_comments WHERE id = $1', [id]);

        return res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error: any) {
        console.error('[COMMUNITY] Error deleting comment:', error);
        return res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
};

// POST /api/community/report - Reportar contenido inapropiado
export const reportContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { itemType, itemId, reason } = req.body;

        if (!itemType || !itemId || !reason) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (itemType !== 'post' && itemType !== 'comment') {
            return res.status(400).json({ error: 'Tipo de contenido inválido' });
        }

        // Verificar que el contenido existe
        const table = itemType === 'post' ? 'community_posts' : 'community_comments';
        const checkResult = await pool.query(
            `SELECT id FROM ${table} WHERE id = $1`,
            [itemId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const result = await pool.query(`
            INSERT INTO community_reports (reporter_user_id, reported_item_type, reported_item_id, reason)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [userId, itemType, itemId, reason]);

        return res.status(201).json({
            message: 'Reporte enviado correctamente',
            report: result.rows[0]
        });
    } catch (error: any) {
        console.error('[COMMUNITY] Error creating report:', error);
        return res.status(500).json({ error: 'Error al enviar el reporte' });
    }
};
