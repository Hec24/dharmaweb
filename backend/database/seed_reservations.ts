// backend/database/seed_reservations.ts
import pool from './db';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// IMPORTANTE: Cambia este email por el email de tu usuario de prueba
const TEST_USER_EMAIL = 'hectorp24293@gmail.com'; // ⚠️ CAMBIAR POR TU EMAIL

const reservations = [
    {
        // Reserva PRÓXIMA (en 5 días)
        nombre: 'Usuario',
        apellidos: 'De Prueba',
        email: TEST_USER_EMAIL,
        telefono: '+34 600 000 000',
        acompanante: 'María García',
        acompanante_email: 'maria@dharmaenruta.com',
        fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +5 días
        hora: '10:00:00',
        duracion_min: 60,
        estado: 'pagada',
        precio_pagado: 80.00
    },
    {
        // Reserva PRÓXIMA (en 10 días)
        nombre: 'Usuario',
        apellidos: 'De Prueba',
        email: TEST_USER_EMAIL,
        telefono: '+34 600 000 000',
        acompanante: 'Carlos Ruiz',
        acompanante_email: 'carlos@dharmaenruta.com',
        fecha: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +10 días
        hora: '16:30:00',
        duracion_min: 90,
        estado: 'pagada',
        precio_pagado: 120.00
    },
    {
        // Reserva PASADA (hace 7 días) - Completada
        nombre: 'Usuario',
        apellidos: 'De Prueba',
        email: TEST_USER_EMAIL,
        telefono: '+34 600 000 000',
        acompanante: 'Ana López',
        acompanante_email: 'ana@dharmaenruta.com',
        fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // -7 días
        hora: '11:00:00',
        duracion_min: 60,
        estado: 'completada',
        precio_pagado: 80.00
    },
    {
        // Reserva PASADA (hace 15 días) - Cancelada
        nombre: 'Usuario',
        apellidos: 'De Prueba',
        email: TEST_USER_EMAIL,
        telefono: '+34 600 000 000',
        acompanante: 'Pedro Martín',
        acompanante_email: 'pedro@dharmaenruta.com',
        fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // -15 días
        hora: '14:00:00',
        duracion_min: 60,
        estado: 'cancelada',
        precio_pagado: 80.00,
        cancelled_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        cancellation_reason: 'Cancelada por el usuario con más de 24h de antelación'
    }
];

async function seed() {
    try {
        console.log('🌱 Seeding reservations...');
        console.log(`📧 Using email: ${TEST_USER_EMAIL}`);

        for (const reservation of reservations) {
            const id = uuidv4();

            const query = `
                INSERT INTO reservations (
                    id, nombre, apellidos, email, telefono,
                    acompanante, acompanante_email, fecha, hora, duracion_min,
                    estado, precio_pagado, cancelled_at, cancellation_reason
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (id) DO NOTHING
            `;

            await pool.query(query, [
                id,
                reservation.nombre,
                reservation.apellidos,
                reservation.email,
                reservation.telefono,
                reservation.acompanante,
                reservation.acompanante_email,
                reservation.fecha,
                reservation.hora,
                reservation.duracion_min,
                reservation.estado,
                reservation.precio_pagado,
                reservation.cancelled_at || null,
                reservation.cancellation_reason || null
            ]);

            console.log(`  ✓ ${reservation.estado.toUpperCase()}: ${reservation.fecha} ${reservation.hora} - ${reservation.acompanante}`);
        }

        console.log('\n✅ Reservations seeded successfully!');
        console.log(`\n💡 Tip: Login with email "${TEST_USER_EMAIL}" to see these reservations`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding reservations:', error);
        process.exit(1);
    }
}

seed();
