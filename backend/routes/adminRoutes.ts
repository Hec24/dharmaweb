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
