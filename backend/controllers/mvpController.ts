// MVP Purchase and Membership Controller
// Handles Stripe payments for MVP and automatic membership activation

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Pool } from 'pg';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Prices (in cents) - TODO: Move to environment variables
const PRICES = {
    MVP: 2900, // €29
    MEMBERSHIP_QUARTERLY: 4700, // €47
    MEMBERSHIP_BIANNUAL: 8700, // €87
    MVP_DISCOUNT_PERCENT: 20, // 20% discount for MVP buyers
};

/**
 * Create Stripe Checkout Session for MVP Purchase
 * POST /api/mvp/checkout
 */
export async function createMVPCheckout(req: Request, res: Response) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Create or retrieve Stripe customer
        let customer;
        const existingCustomers = await stripe.customers.list({ email, limit: 1 });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email,
                metadata: {
                    source: 'mvp_purchase',
                    purchase_date: new Date().toISOString(),
                },
            });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Test Rueda de la Vida + Acceso Anticipado',
                            description: 'Test personalizado + PDF + Acceso anticipado a la membresía hasta el 21 de marzo',
                            images: ['https://dharmaenruta.com/og/mvp.jpg'], // TODO: Add actual image
                        },
                        unit_amount: PRICES.MVP,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/mvp/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/mvp/cancel`,
            metadata: {
                type: 'mvp_purchase',
                email,
            },
            // Save payment method for future use
            payment_intent_data: {
                setup_future_usage: 'off_session',
                metadata: {
                    type: 'mvp_purchase',
                    email,
                },
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Error creating MVP checkout:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handle successful MVP purchase
 * Called by webhook or frontend after successful payment
 * POST /api/mvp/purchase-success
 */
export async function handleMVPPurchaseSuccess(req: Request, res: Response) {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'customer'],
        });

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        const customer = session.customer as Stripe.Customer;
        const paymentIntent = session.payment_intent as Stripe.PaymentIntent;

        // Save MVP purchase to database
        const result = await pool.query(
            `INSERT INTO mvp_purchases 
       (email, stripe_customer_id, stripe_payment_intent_id, amount_paid, purchased_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
            [customer.email, customer.id, paymentIntent.id, session.amount_total]
        );

        // TODO: Send welcome email with test link and account creation instructions
        // TODO: Add to MailerLite "MVP Buyers" group

        res.json({
            success: true,
            purchaseId: result.rows[0].id,
            email: customer.email,
            message: 'MVP purchase recorded successfully',
        });
    } catch (error: any) {
        console.error('Error handling MVP purchase:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Create account after MVP purchase
 * POST /api/mvp/create-account
 */
export async function createAccountFromMVP(req: Request, res: Response) {
    try {
        const { email, password, nombre, apellidos } = req.body;

        if (!email || !password || !nombre || !apellidos) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if MVP purchase exists
        const mvpPurchase = await pool.query(
            'SELECT * FROM mvp_purchases WHERE email = $1 AND account_created = FALSE',
            [email]
        );

        if (mvpPurchase.rows.length === 0) {
            return res.status(404).json({ error: 'No MVP purchase found for this email' });
        }

        const purchase = mvpPurchase.rows[0];

        // Hash password (assuming you have a hash function)
        const bcrypt = require('bcrypt');
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user account
        const userResult = await pool.query(
            `INSERT INTO users 
       (email, password_hash, nombre, apellidos, has_mvp_access, stripe_customer_id, membership_status)
       VALUES ($1, $2, $3, $4, TRUE, $5, 'mvp_only')
       RETURNING id`,
            [email, passwordHash, nombre, apellidos, purchase.stripe_customer_id]
        );

        const userId = userResult.rows[0].id;

        // Update MVP purchase record
        await pool.query(
            'UPDATE mvp_purchases SET account_created = TRUE, user_id = $1 WHERE id = $2',
            [userId, purchase.id]
        );

        res.json({
            success: true,
            userId,
            message: 'Account created successfully with MVP access',
        });
    } catch (error: any) {
        console.error('Error creating account from MVP:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Schedule membership activation for March 21
 * This would be called by a cron job on March 21, 2026
 * POST /api/membership/activate-mvp-members
 */
export async function activateMVPMemberships(req: Request, res: Response) {
    try {
        // Get all users with MVP access who haven't had membership activated
        const mvpUsers = await pool.query(
            `SELECT u.id, u.email, u.stripe_customer_id, mp.id as purchase_id
       FROM users u
       JOIN mvp_purchases mp ON u.id = mp.user_id
       WHERE u.has_mvp_access = TRUE 
       AND mp.membership_activated = FALSE
       AND u.membership_status = 'mvp_only'`
        );

        const results = {
            total: mvpUsers.rows.length,
            successful: 0,
            failed: 0,
            errors: [] as any[],
        };

        for (const user of mvpUsers.rows) {
            try {
                // Calculate discounted price
                const discountedQuarterly = Math.round(
                    PRICES.MEMBERSHIP_QUARTERLY * (1 - PRICES.MVP_DISCOUNT_PERCENT / 100)
                );

                // Create subscription with first payment
                const subscription = await stripe.subscriptions.create({
                    customer: user.stripe_customer_id,
                    items: [
                        {
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: 'Membresía Dharma en Ruta - Trimestral',
                                    description: 'Acceso completo a todos los contenidos y comunidad',
                                },
                                unit_amount: discountedQuarterly,
                                recurring: {
                                    interval: 'month',
                                    interval_count: 3, // Every 3 months
                                },
                            },
                        },
                    ],
                    metadata: {
                        user_id: user.id,
                        mvp_discount_applied: 'true',
                    },
                });

                // Update user record
                await pool.query(
                    `UPDATE users 
           SET membership_status = 'active',
               membership_start_date = NOW(),
               membership_end_date = NOW() + INTERVAL '3 months',
               stripe_subscription_id = $1,
               subscription_interval = 'quarterly',
               mvp_discount_applied = TRUE
           WHERE id = $2`,
                    [subscription.id, user.id]
                );

                // Update MVP purchase record
                await pool.query(
                    `UPDATE mvp_purchases 
           SET membership_activated = TRUE,
               membership_activation_date = NOW()
           WHERE id = $1`,
                    [user.purchase_id]
                );

                // Record payment
                await pool.query(
                    `INSERT INTO payment_history 
           (user_id, stripe_payment_intent_id, amount, payment_type, status)
           VALUES ($1, $2, $3, 'membership_initial', 'succeeded')`,
                    [user.id, subscription.latest_invoice, discountedQuarterly, 'membership_initial']
                );

                results.successful++;
            } catch (error: any) {
                console.error(`Error activating membership for user ${user.id}:`, error);
                results.failed++;
                results.errors.push({
                    userId: user.id,
                    email: user.email,
                    error: error.message,
                });
            }
        }

        res.json(results);
    } catch (error: any) {
        console.error('Error activating MVP memberships:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 */
export async function handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.metadata?.type === 'mvp_purchase') {
                    // Handle MVP purchase
                    await handleMVPPurchaseSuccess({ body: { sessionId: session.id } } as Request, res);
                }
                break;

            case 'invoice.payment_succeeded':
                // Handle successful subscription payment
                const invoice = event.data.object as Stripe.Invoice;
                console.log('Payment succeeded:', invoice.id);
                // TODO: Update membership end date
                break;

            case 'invoice.payment_failed':
                // Handle failed payment
                const failedInvoice = event.data.object as Stripe.Invoice;
                console.log('Payment failed:', failedInvoice.id);
                // TODO: Send email to update payment method
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
}
