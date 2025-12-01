// backend/controllers/reservasController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// Obtener reservas del usuario autenticado
export async function getMisReservas(req: Request, res: Response) {
    try {
        const userId = (req as any).userId;
        const userEmail = (req as any).userEmail;

        if (!userId || !userEmail) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        console.log('[RESERVAS] Getting reservations for user:', userEmail);

        // Obtener todas las reservas del usuario (por email o user_id)
        const query = `
            SELECT * FROM reservations
            WHERE email = $1 OR user_id = $2
            ORDER BY fecha DESC, hora DESC
        `;

        const result = await pool.query(query, [userEmail, userId]);
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        console.log('[RESERVAS] Raw query results:', {
            count: result.rows.length,
            today,
            rows: result.rows.map(r => ({
                id: r.id,
                fecha: r.fecha,
                fechaType: typeof r.fecha,
                estado: r.estado
            }))
        });

        // Separar en próximas y pasadas
        // Convertir fecha de PostgreSQL a string para comparación
        const upcoming = result.rows.filter(r => {
            const fechaStr = r.fecha instanceof Date
                ? r.fecha.toISOString().split('T')[0]
                : r.fecha;
            const isUpcoming = fechaStr >= today && r.estado !== 'cancelada';
            console.log('[RESERVAS] Filter check:', {
                id: String(r.id).substring(0, 8),
                fechaStr,
                today,
                comparison: fechaStr >= today,
                estado: r.estado,
                isUpcoming
            });
            return isUpcoming;
        });

        const past = result.rows.filter(r => {
            const fechaStr = r.fecha instanceof Date
                ? r.fecha.toISOString().split('T')[0]
                : r.fecha;
            return fechaStr < today || r.estado === 'cancelada';
        });

        // Ordenar: próximas ASC, pasadas DESC
        upcoming.sort((a, b) => {
            const dateCompare = a.fecha.localeCompare(b.fecha);
            if (dateCompare !== 0) return dateCompare;
            return a.hora.localeCompare(b.hora);
        });

        past.sort((a, b) => {
            const dateCompare = b.fecha.localeCompare(a.fecha);
            if (dateCompare !== 0) return dateCompare;
            return b.hora.localeCompare(a.hora);
        });

        console.log(`[RESERVAS] Found ${upcoming.length} upcoming, ${past.length} past`);

        return res.json({ upcoming, past });
    } catch (error) {
        console.error('[RESERVAS] Error getting reservations:', error);
        return res.status(500).json({ error: 'Error al obtener las reservas' });
    }
}

// Cancelar una reserva
export async function cancelReservation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const userEmail = (req as any).userEmail;

        if (!userId || !userEmail) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        console.log('[RESERVAS] Cancelling reservation:', id);

        // Verificar que la reserva existe y pertenece al usuario
        const checkQuery = `
            SELECT * FROM reservations
            WHERE id = $1 AND (email = $2 OR user_id = $3)
        `;
        const checkResult = await pool.query(checkQuery, [id, userEmail, userId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        const reserva = checkResult.rows[0];

        // Verificar que no esté ya cancelada
        if (reserva.estado === 'cancelada') {
            return res.status(400).json({ error: 'La reserva ya está cancelada' });
        }

        // Verificar política de cancelación (24 horas)
        const reservaDateTime = new Date(`${reserva.fecha}T${reserva.hora}`);
        const now = new Date();
        const hoursUntilReservation = (reservaDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        let canRefund = false;
        if (hoursUntilReservation < 24) {
            console.log('[RESERVAS] Cancellation within 24h - no refund');
            canRefund = false;
        } else {
            console.log('[RESERVAS] Cancellation with 24h+ notice - refund eligible');
            canRefund = true;
        }

        // Actualizar estado a cancelada
        const updateQuery = `
            UPDATE reservations
            SET estado = 'cancelada',
                cancelled_at = NOW(),
                cancellation_reason = $1
            WHERE id = $2
            RETURNING *
        `;

        const reason = canRefund
            ? 'Cancelada por el usuario con más de 24h de antelación'
            : 'Cancelada por el usuario con menos de 24h de antelación (sin reembolso)';

        const updateResult = await pool.query(updateQuery, [reason, id]);

        // TODO: Eliminar evento de Google Calendar si existe
        if (reserva.event_id) {
            console.log('[RESERVAS] TODO: Delete Google Calendar event:', reserva.event_id);
            // Aquí iría la lógica para eliminar el evento del calendario
        }

        // TODO: Procesar reembolso si aplica
        if (canRefund && reserva.stripe_session_id) {
            console.log('[RESERVAS] TODO: Process refund for session:', reserva.stripe_session_id);
            // Aquí iría la lógica de reembolso con Stripe
        }

        console.log('[RESERVAS] Reservation cancelled successfully');

        return res.json({
            success: true,
            canRefund,
            reservation: updateResult.rows[0]
        });
    } catch (error) {
        console.error('[RESERVAS] Error cancelling reservation:', error);
        return res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
}
