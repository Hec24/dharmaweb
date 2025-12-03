// backend/routes/adminRoutes.ts
import { Request, Response } from 'express';
import pool from '../database/db';

const RESERVATIONS_SCHEMA = `
-- Tabla de reservas/acompañamientos
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información del cliente
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    
    -- Información del acompañamiento
    acompanante VARCHAR(255) NOT NULL,
    acompanante_email VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    duracion_min INTEGER DEFAULT 60,
    
    -- Estado y pago
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'pagada', 'cancelada', 'completada')),
    stripe_session_id VARCHAR(255),
    precio_pagado DECIMAL(10, 2),
    
    -- Facturación (opcional)
    direccion TEXT,
    pais VARCHAR(100),
    poblacion VARCHAR(100),
    zip_code VARCHAR(20),
    
    -- Sincronización con Google Calendar
    event_id VARCHAR(255),
    hold_expires_at BIGINT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);
CREATE INDEX IF NOT EXISTS idx_reservations_fecha ON reservations(fecha);
CREATE INDEX IF NOT EXISTS idx_reservations_estado ON reservations(estado);
CREATE INDEX IF NOT EXISTS idx_reservations_acompanante_fecha ON reservations(acompanante, fecha, hora);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservations_updated_at();
`;

export async function runMigration(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running reservations migration...');

        await pool.query(RESERVATIONS_SCHEMA);

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

export async function debugReservations(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(`
            SELECT 
                id, user_id, nombre, apellidos, email, 
                acompanante, fecha, hora, estado,
                created_at, updated_at
            FROM reservations 
            ORDER BY created_at DESC 
            LIMIT 20
        `);

        return res.json({
            count: result.rows.length,
            reservations: result.rows
        });
    } catch (error: any) {
        console.error('❌ Debug error:', error);
        return res.status(500).json({
            error: 'Debug failed',
            details: error.message
        });
    }
}

export async function clearReservations(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🧹 Clearing all reservations...');

        // TRUNCATE es más rápido y resetea contadores si los hubiera
        await pool.query('TRUNCATE TABLE reservations CASCADE');

        console.log('✅ Reservations table cleared');

        return res.json({
            success: true,
            message: 'All reservations deleted successfully'
        });
    } catch (error: any) {
        console.error('❌ Clear error:', error);
        return res.status(500).json({
            error: 'Clear failed',
            details: error.message
        });
    }
}

export async function setUserStatus(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { email, status } = req.body;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!email || !status) {
            return res.status(400).json({ error: 'Email and status are required' });
        }

        const result = await pool.query(
            'UPDATE users SET membership_status = $1 WHERE email = $2 RETURNING id, email, membership_status',
            [status, email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`✅ User ${email} status updated to ${status}`);

        return res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error: any) {
        console.error('❌ Update status error:', error);
        return res.status(500).json({
            error: 'Update failed',
            details: error.message
        });
    }
}

// ========= Live Events Admin Functions =========

export async function migrateLiveEvents(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running live events migration...');

        const schema = `
            CREATE TABLE IF NOT EXISTS live_events (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                area VARCHAR(100) NOT NULL,
                instructor VARCHAR(100) NOT NULL,
                zoom_link TEXT,
                scheduled_at TIMESTAMP NOT NULL,
                duration_minutes INTEGER DEFAULT 60,
                is_published BOOLEAN DEFAULT false,
                max_attendees INTEGER,
                thumbnail_url TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS event_registrations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                registered_at TIMESTAMP DEFAULT NOW(),
                attended BOOLEAN DEFAULT false,
                UNIQUE(event_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS event_recordings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
                video_provider VARCHAR(50) NOT NULL,
                video_id VARCHAR(255) NOT NULL,
                duration_minutes INTEGER,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_events_scheduled ON live_events(scheduled_at);
            CREATE INDEX IF NOT EXISTS idx_events_area ON live_events(area);
            CREATE INDEX IF NOT EXISTS idx_events_published ON live_events(is_published);
            CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
            CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
            CREATE INDEX IF NOT EXISTS idx_recordings_event ON event_recordings(event_id);
        `;

        await pool.query(schema);

        console.log('✅ Live events migration completed');

        return res.json({
            success: true,
            message: 'Live events tables created successfully'
        });
    } catch (error: any) {
        console.error('❌ Migration error:', error);
        return res.status(500).json({
            error: 'Migration failed',
            details: error.message
        });
    }
}

export async function seedEvents(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🌱 Seeding test events...');

        // Event 1: Upcoming meditation
        await pool.query(`
            INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published)
            VALUES (
                'Meditación Matutina',
                'Sesión de meditación guiada para empezar el día con claridad y presencia. Exploraremos técnicas de respiración consciente y visualización.',
                'elsenderodelyo',
                'Ana García',
                'https://zoom.us/j/123456789',
                NOW() + INTERVAL '3 days',
                60,
                true
            )
        `);

        // Event 2: Upcoming finance workshop
        await pool.query(`
            INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published, max_attendees)
            VALUES (
                'Taller de Presupuesto Consciente',
                'Aprende a crear un presupuesto que refleje tus valores y te ayude a alcanzar tus metas financieras con paz mental.',
                'finanzasparaunavidalibre',
                'Carlos Mendoza',
                'https://zoom.us/j/987654321',
                NOW() + INTERVAL '5 days',
                90,
                true,
                20
            )
        `);

        // Event 3: Upcoming yoga
        await pool.query(`
            INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published)
            VALUES (
                'Yoga para Principiantes',
                'Clase de yoga suave enfocada en la conexión cuerpo-mente. Ideal para quienes están comenzando su práctica.',
                'elcaminodelbienestar',
                'María López',
                'https://zoom.us/j/555666777',
                NOW() + INTERVAL '7 days',
                75,
                true
            )
        `);

        // Event 4: Past event
        const pastEventResult = await pool.query(`
            INSERT INTO live_events (title, description, area, instructor, scheduled_at, duration_minutes, is_published)
            VALUES (
                'Introducción al Dharma',
                'Primera sesión del ciclo de introducción a las enseñanzas del Dharma. Exploramos los conceptos fundamentales.',
                'dialogosdeldharma',
                'Roberto Sánchez',
                NOW() - INTERVAL '2 days',
                120,
                true
            )
            RETURNING id
        `);

        // Add recording to past event
        const pastEventId = pastEventResult.rows[0].id;
        await pool.query(`
            INSERT INTO event_recordings (event_id, video_provider, video_id, duration_minutes)
            VALUES ($1, 'youtube', 'dQw4w9WgXcQ', 120)
        `, [pastEventId]);

        console.log('✅ Test events seeded successfully');

        return res.json({
            success: true,
            message: '4 test events created successfully (3 upcoming, 1 past with recording)'
        });
    } catch (error: any) {
        console.error('❌ Seed error:', error);
        return res.status(500).json({
            error: 'Seed failed',
            details: error.message
        });
    }
}

// Delete event
export async function deleteEvent(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🗑️ Deleting event:', id);

        const result = await pool.query(
            'DELETE FROM live_events WHERE id = $1 RETURNING id, title',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        console.log('✅ Event deleted:', result.rows[0].title);

        return res.json({
            success: true,
            message: `Event "${result.rows[0].title}" deleted successfully`
        });
    } catch (error: any) {
        console.error('❌ Delete error:', error);
        return res.status(500).json({
            error: 'Delete failed',
            details: error.message
        });
    }
}
// Debug events
export async function debugEvents(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // 1. Raw dump
        const result = await pool.query('SELECT * FROM live_events ORDER BY created_at DESC');

        // 2. Simulate getUpcomingEvents query
        const userId = '00000000-0000-0000-0000-000000000000';
        const upcomingQuery = `
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
            GROUP BY e.id, ur.id
            ORDER BY e.scheduled_at ASC
        `;
        const upcomingResult = await pool.query(upcomingQuery, [userId]);

        // 3. Check DB time
        const timeResult = await pool.query('SELECT NOW() as db_time');

        return res.json({
            serverTime: new Date().toISOString(),
            dbTime: timeResult.rows[0].db_time,
            totalCount: result.rows.length,
            upcomingCount: upcomingResult.rows.length,
            upcomingEvents: upcomingResult.rows,
            allEvents: result.rows
        });
    } catch (error: any) {
        console.error('❌ Debug events error:', error);
        return res.status(500).json({
            error: 'Debug failed',
            details: error.message
        });
    }
}

// ========= Community Admin Functions =========

export async function migrateCommunity(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running community migration...');

        const schema = `
            CREATE TABLE IF NOT EXISTS community_posts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                area VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                is_pinned BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS community_comments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS community_reports (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                reporter_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                reported_item_type VARCHAR(20) NOT NULL CHECK (reported_item_type IN ('post', 'comment')),
                reported_item_id UUID NOT NULL,
                reason TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
                created_at TIMESTAMP DEFAULT NOW(),
                reviewed_at TIMESTAMP,
                reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_posts_area ON community_posts(area);
            CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id);
            CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_posts_pinned ON community_posts(is_pinned);

            CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
            CREATE INDEX IF NOT EXISTS idx_comments_user ON community_comments(user_id);
            CREATE INDEX IF NOT EXISTS idx_comments_created ON community_comments(created_at);

            CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status);
            CREATE INDEX IF NOT EXISTS idx_reports_reporter ON community_reports(reporter_user_id);
            CREATE INDEX IF NOT EXISTS idx_reports_created ON community_reports(created_at DESC);
        `;

        await pool.query(schema);

        console.log('✅ Community migration completed');

        return res.json({
            success: true,
            message: 'Community tables created successfully'
        });
    } catch (error: any) {
        console.error('❌ Migration error:', error);
        return res.status(500).json({
            error: 'Migration failed',
            details: error.message
        });
    }
}

// Get all pending reports
export async function getReports(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(`
            SELECT 
                r.id,
                r.reported_item_type,
                r.reported_item_id,
                r.reason,
                r.status,
                r.created_at,
                r.reviewed_at,
                reporter.nombre as reporter_name,
                reviewer.nombre as reviewer_name
            FROM community_reports r
            JOIN users reporter ON r.reporter_user_id = reporter.id
            LEFT JOIN users reviewer ON r.reviewed_by_user_id = reviewer.id
            ORDER BY 
                CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END,
                r.created_at DESC
        `);

        return res.json({
            count: result.rows.length,
            reports: result.rows
        });
    } catch (error: any) {
        console.error('❌ Get reports error:', error);
        return res.status(500).json({
            error: 'Failed to get reports',
            details: error.message
        });
    }
}

// Review a report (mark as reviewed or dismissed)
export async function reviewReport(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;
        const { status, adminUserId } = req.body;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!status || (status !== 'reviewed' && status !== 'dismissed')) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(`
            UPDATE community_reports
            SET status = $1, reviewed_at = NOW(), reviewed_by_user_id = $2
            WHERE id = $3
            RETURNING *
        `, [status, adminUserId, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        console.log(`✅ Report ${id} marked as ${status}`);

        return res.json({
            success: true,
            report: result.rows[0]
        });
    } catch (error: any) {
        console.error('❌ Review report error:', error);
        return res.status(500).json({
            error: 'Failed to review report',
            details: error.message
        });
    }
}

// Delete any post (admin)
export async function deletePostAdmin(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'DELETE FROM community_posts WHERE id = $1 RETURNING id, title',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log('✅ Post deleted by admin:', result.rows[0].title);

        return res.json({
            success: true,
            message: `Post "${result.rows[0].title}" deleted successfully`
        });
    } catch (error: any) {
        console.error('❌ Delete post error:', error);
        return res.status(500).json({
            error: 'Failed to delete post',
            details: error.message
        });
    }
}

// Delete any comment (admin)
export async function deleteCommentAdmin(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'DELETE FROM community_comments WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        console.log('✅ Comment deleted by admin:', id);

        return res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error: any) {
        console.error('❌ Delete comment error:', error);
        return res.status(500).json({
            error: 'Failed to delete comment',
            details: error.message
        });
    }
}

// Pin/unpin a post
export async function pinPost(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;
        const { pinned } = req.body;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'UPDATE community_posts SET is_pinned = $1 WHERE id = $2 RETURNING id, title, is_pinned',
            [pinned, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log(`✅ Post ${pinned ? 'pinned' : 'unpinned'}:`, result.rows[0].title);

        return res.json({
            success: true,
            post: result.rows[0]
        });
    } catch (error: any) {
        console.error('❌ Pin post error:', error);
        return res.status(500).json({
            error: 'Failed to pin/unpin post',
            details: error.message
        });
    }
}

// ========= Resources Admin Functions =========

export async function migrateResources(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running resources migration...');

        const schema = `
            CREATE TABLE IF NOT EXISTS community_resources (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('pdf', 'link', 'guide', 'video', 'article')),
                url TEXT NOT NULL,
                area VARCHAR(100),
                is_featured BOOLEAN DEFAULT false,
                created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_resources_area ON community_resources(area);
            CREATE INDEX IF NOT EXISTS idx_resources_featured ON community_resources(is_featured);
            CREATE INDEX IF NOT EXISTS idx_resources_created ON community_resources(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_resources_type ON community_resources(resource_type);
        `;

        await pool.query(schema);

        console.log('✅ Resources migration completed');

        return res.json({
            success: true,
            message: 'Resources tables created successfully'
        });
    } catch (error: any) {
        console.error('❌ Migration error:', error);
        return res.status(500).json({
            error: 'Migration failed',
            details: error.message
        });
    }
}

export async function createResourceAdmin(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { title, description, resource_type, url, area, is_featured } = req.body;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(`
            INSERT INTO community_resources (title, description, resource_type, url, area, is_featured)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [title, description, resource_type, url, area || null, is_featured || false]);

        console.log('✅ Resource created:', result.rows[0].title);

        return res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('❌ Create resource error:', error);
        return res.status(500).json({
            error: 'Failed to create resource',
            details: error.message
        });
    }
}

export async function deleteResourceAdmin(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'DELETE FROM community_resources WHERE id = $1 RETURNING id, title',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        console.log('✅ Resource deleted:', result.rows[0].title);

        return res.json({
            success: true,
            message: `Resource "${result.rows[0].title}" deleted successfully`
        });
    } catch (error: any) {
        console.error('❌ Delete resource error:', error);
        return res.status(500).json({
            error: 'Failed to delete resource',
            details: error.message
        });
    }
}

// ========= Questions Admin Functions =========

export async function migrateQuestions(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('🔧 Running questions migration...');

        const schema = `
            CREATE TABLE IF NOT EXISTS event_questions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                question TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'featured')),
                votes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS question_votes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                question_id UUID REFERENCES event_questions(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(question_id, user_id)
            );

            CREATE INDEX IF NOT EXISTS idx_questions_event ON event_questions(event_id);
            CREATE INDEX IF NOT EXISTS idx_questions_user ON event_questions(user_id);
            CREATE INDEX IF NOT EXISTS idx_questions_status ON event_questions(status);
            CREATE INDEX IF NOT EXISTS idx_questions_votes ON event_questions(votes DESC);
            CREATE INDEX IF NOT EXISTS idx_question_votes_question ON question_votes(question_id);
            CREATE INDEX IF NOT EXISTS idx_question_votes_user ON question_votes(user_id);
        `;

        await pool.query(schema);

        console.log('✅ Questions migration completed');

        return res.json({
            success: true,
            message: 'Questions tables created successfully'
        });
    } catch (error: any) {
        console.error('❌ Migration error:', error);
        return res.status(500).json({
            error: 'Migration failed',
            details: error.message
        });
    }
}

export async function markQuestionAnswered(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;
        const { status } = req.body;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'UPDATE event_questions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        console.log('✅ Question status updated:', status);

        return res.json(result.rows[0]);
    } catch (error: any) {
        console.error('❌ Update question error:', error);
        return res.status(500).json({
            error: 'Failed to update question',
            details: error.message
        });
    }
}

export async function deleteQuestionAdmin(req: Request, res: Response) {
    try {
        const adminToken = req.headers['x-admin-token'];
        const { id } = req.params;

        if (adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = await pool.query(
            'DELETE FROM event_questions WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        console.log('✅ Question deleted:', id);

        return res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error: any) {
        console.error('❌ Delete question error:', error);
        return res.status(500).json({
            error: 'Failed to delete question',
            details: error.message
        });
    }
}
