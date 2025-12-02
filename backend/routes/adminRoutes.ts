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
