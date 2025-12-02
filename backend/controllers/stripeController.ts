// backend/controllers/stripeController.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../database/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Create a Stripe Customer Portal session
 * Allows users to manage payment methods, view invoices, etc.
 */
export async function createPortalSession(req: Request, res: Response) {
    try {
        const userId = (req as any).userId;
        const userEmail = (req as any).userEmail;

        if (!userId || !userEmail) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        // Get user from database
        const userResult = await pool.query(
            'SELECT id, email, nombre, apellidos, stripe_customer_id FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];
        let customerId = user.stripe_customer_id;

        // If user doesn't have a Stripe customer ID, create one
        if (!customerId) {
            console.log('[STRIPE] Creating new customer for user:', user.email);

            const customer = await stripe.customers.create({
                email: user.email,
                name: `${user.nombre} ${user.apellidos}`,
                metadata: {
                    userId: user.id,
                },
            });

            customerId = customer.id;

            // Save customer ID to database
            await pool.query(
                'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
                [customerId, userId]
            );

            console.log('[STRIPE] Customer created:', customerId);
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${FRONTEND_URL}/dashboard/perfil`,
        });

        console.log('[STRIPE] Portal session created for customer:', customerId);

        return res.json({ url: session.url });
    } catch (error: any) {
        console.error('[STRIPE] Error creating portal session:', error);
        return res.status(500).json({
            error: 'Error al crear la sesión del portal de pagos',
            details: error.message
        });
    }
}

/**
 * Get or create Stripe customer for a user
 * Used internally by other functions
 */
export async function getOrCreateCustomer(userId: string, email: string, nombre: string, apellidos: string): Promise<string> {
    // Check if user already has a customer ID
    const userResult = await pool.query(
        'SELECT stripe_customer_id FROM users WHERE id = $1',
        [userId]
    );

    if (userResult.rows.length > 0 && userResult.rows[0].stripe_customer_id) {
        return userResult.rows[0].stripe_customer_id;
    }

    // Create new customer
    const customer = await stripe.customers.create({
        email,
        name: `${nombre} ${apellidos}`,
        metadata: { userId },
    });

    // Save to database
    await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, userId]
    );

    return customer.id;
}
