
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import pool from '../database/db';

async function checkVideoProgress() {
    const email = 'hectorp24293@gmail.com'; // Tu email
    console.log(`🔍 Checking video progress for: ${email}`);

    try {
        // 1. Get User
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            console.log('❌ User not found');
            return;
        }
        const userId = userRes.rows[0].id;
        console.log(`✅ User ID: ${userId}`);

        // 2. Check ALL progress for this user
        console.log('\n--- ALL Video Progress Entries ---');
        const allProgress = await pool.query(`
            SELECT vp.*, v.title, v.is_published
            FROM video_progress vp
            LEFT JOIN videos v ON vp.video_id = v.id
            WHERE vp.user_id = $1
        `, [userId]);

        if (allProgress.rows.length === 0) {
            console.log('❌ No progress entries found at all.');
        } else {
            allProgress.rows.forEach((p, i) => {
                console.log(`\nEntry #${i + 1}:`);
                console.log(`- Video: ${p.title} (ID: ${p.video_id})`);
                console.log(`- Published: ${p.is_published}`);
                console.log(`- Completed: ${p.is_completed} (Must be FALSE to show)`);
                console.log(`- Watched: ${p.watched_seconds}/${p.total_seconds}`);
                console.log(`- Last Watched: ${p.last_watched_at}`);
            });
        }

        // 3. Simulate the exact query used in controller
        console.log('\n--- Simulating Dashboard Query ---');
        const query = `
            SELECT v.*, 
                   vp.watched_seconds, 
                   vp.total_seconds, 
                   vp.is_completed,
                   vp.last_watched_at
            FROM video_progress vp
            INNER JOIN videos v ON v.id = vp.video_id
            WHERE vp.user_id = $1 
              AND v.is_published = true
              AND vp.is_completed = false
            ORDER BY vp.last_watched_at DESC
            LIMIT 1
        `;

        const dashboardRes = await pool.query(query, [userId]);
        if (dashboardRes.rows.length > 0) {
            console.log('✅ Query returns a video:', dashboardRes.rows[0].title);
        } else {
            console.log('❌ Query returns NULL (No video to show)');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkVideoProgress();
