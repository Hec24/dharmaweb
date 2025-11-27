import pool from './db';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const videos = [
    {
        title: "Introducción al Sendero del Yo",
        description: "En este vídeo exploramos los fundamentos del autoconocimiento y cómo empezar tu viaje interior.",
        area: "elsenderodelyo",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ", // Rick Roll placeholder
        duration_minutes: 15,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Finanzas Conscientes: Primeros Pasos",
        description: "Aprende a relacionarte con el dinero desde la abundancia y la consciencia.",
        area: "finanzasparaunavidalibre",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 25,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Diálogos del Dharma: La Impermanencia",
        description: "Una conversación profunda sobre la naturaleza cambiante de la realidad.",
        area: "dialogosdeldharma",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 45,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Habitar tu Espacio",
        description: "Cómo crear un entorno que nutra tu alma y apoye tu práctica.",
        area: "elartedehabitar",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 20,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Expresión Creativa",
        description: "Libera tu voz y encuentra tu forma única de expresión.",
        area: "templodeexpresionyencuentro",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 30,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Bienestar Integral",
        description: "Rutinas diarias para cultivar salud física, mental y emocional.",
        area: "elcaminodelbienestar",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 18,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Relaciones Conscientes",
        description: "Herramientas para construir vínculos sanos y auténticos.",
        area: "relacionesenarmonia",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 35,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
        title: "Cuerpo y Placer",
        description: "Reconecta con tu cuerpo como fuente de sabiduría y gozo.",
        area: "cuerpoplaceryconexion",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        duration_minutes: 28,
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    }
];

async function seed() {
    try {
        console.log('🌱 Seeding videos...');

        // Limpiar tabla (opcional, cuidado en prod)
        // await pool.query('DELETE FROM videos');

        for (const video of videos) {
            const id = uuidv4();
            await pool.query(`
                INSERT INTO videos (
                    id, title, description, area, video_provider, video_id, 
                    duration_minutes, thumbnail_url, is_published, upload_date
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
                ON CONFLICT (id) DO NOTHING
            `, [
                id, video.title, video.description, video.area, video.video_provider,
                video.video_id, video.duration_minutes, video.thumbnail_url, true
            ]);
        }

        console.log('✅ Videos seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding videos:', error);
        process.exit(1);
    }
}

seed();
