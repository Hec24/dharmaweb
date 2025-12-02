-- Script para crear eventos de prueba en la base de datos
-- Ejecutar con: psql $DATABASE_URL -f backend/scripts/seed_events.sql

-- Evento 1: Meditación Matutina (próximo)
INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published, thumbnail_url)
VALUES (
    'Meditación Matutina',
    'Sesión de meditación guiada para empezar el día con claridad y presencia. Exploraremos técnicas de respiración consciente y visualización.',
    'elsenderodelyo',
    'Ana García',
    'https://zoom.us/j/123456789',
    NOW() + INTERVAL '3 days',
    60,
    true,
    null
);

-- Evento 2: Finanzas Conscientes (próximo)
INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published, max_attendees, thumbnail_url)
VALUES (
    'Taller de Presupuesto Consciente',
    'Aprende a crear un presupuesto que refleje tus valores y te ayude a alcanzar tus metas financieras con paz mental.',
    'finanzasparaunavidalibre',
    'Carlos Mendoza',
    'https://zoom.us/j/987654321',
    NOW() + INTERVAL '5 days',
    90,
    true,
    20,
    null
);

-- Evento 3: Yoga y Movimiento (próximo)
INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published, thumbnail_url)
VALUES (
    'Yoga para Principiantes',
    'Clase de yoga suave enfocada en la conexión cuerpo-mente. Ideal para quienes están comenzando su práctica.',
    'elcaminodelbienestar',
    'María López',
    'https://zoom.us/j/555666777',
    NOW() + INTERVAL '7 days',
    75,
    true,
    null
);

-- Evento 4: Evento pasado con grabación
INSERT INTO live_events (title, description, area, instructor, zoom_link, scheduled_at, duration_minutes, is_published, thumbnail_url)
VALUES (
    'Introducción al Dharma',
    'Primera sesión del ciclo de introducción a las enseñanzas del Dharma. Exploramos los conceptos fundamentales.',
    'dialogosdeldharma',
    'Roberto Sánchez',
    null,
    NOW() - INTERVAL '2 days',
    120,
    true,
    null
)
RETURNING id;

-- Nota: Guarda el ID del evento pasado para añadirle una grabación
-- Reemplaza 'EVENT_ID_AQUI' con el ID que te devuelva la query anterior

-- Añadir grabación al evento pasado (ejecutar después de obtener el ID)
-- INSERT INTO event_recordings (event_id, video_provider, video_id, duration_minutes)
-- VALUES (
--     'EVENT_ID_AQUI',
--     'youtube',
--     'dQw4w9WgXcQ',
--     120
-- );

SELECT 'Eventos de prueba creados exitosamente!' as resultado;
