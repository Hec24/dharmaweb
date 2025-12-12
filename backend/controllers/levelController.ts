// backend/controllers/levelController.ts
import { Request, Response } from 'express';
import pool from '../database/db';

// Level thresholds (matches database level_definitions)
const LEVEL_THRESHOLDS = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 500 },
    { level: 5, xp: 1000 },
    { level: 6, xp: 1750 },
    { level: 7, xp: 2750 },
    { level: 8, xp: 4000 },
    { level: 9, xp: 6000 },
    { level: 10, xp: 10000 }
];

// XP limits
const DAILY_VIDEO_XP_LIMIT = 200;
const DAILY_COMMUNITY_XP_LIMIT = 50;

/**
 * Calculate user's current level based on total XP
 */
export function calculateLevel(totalXp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXp >= LEVEL_THRESHOLDS[i].xp) {
            return LEVEL_THRESHOLDS[i].level;
        }
    }
    return 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
    const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.xp : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
}

/**
 * Award XP to a user
 */
export async function awardXP(
    userId: string,
    actionType: string,
    xpAmount: number,
    referenceId?: string
): Promise<{
    success: boolean;
    reason?: string;
    newXp?: number;
    newLevel?: number;
    leveledUp?: boolean;
    xpEarned?: number;
}> {
    try {
        // Get user's current XP and daily stats
        const userResult = await pool.query(
            `SELECT total_xp, daily_xp, current_level, last_xp_reset_date 
             FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return { success: false, reason: 'user_not_found' };
        }

        const user = userResult.rows[0];
        const today = new Date().toISOString().split('T')[0];

        // Reset daily XP if new day
        let dailyXp = user.daily_xp;
        if (user.last_xp_reset_date !== today) {
            dailyXp = 0;
            await pool.query(
                'UPDATE users SET daily_xp = 0, last_xp_reset_date = $1 WHERE id = $2',
                [today, userId]
            );
        }

        // Check daily limits
        if (actionType.includes('video') && dailyXp >= DAILY_VIDEO_XP_LIMIT) {
            return { success: false, reason: 'daily_video_limit_reached' };
        }

        if (actionType.includes('community') && dailyXp >= DAILY_COMMUNITY_XP_LIMIT) {
            return { success: false, reason: 'daily_community_limit_reached' };
        }

        // Calculate new XP and level
        const newTotalXp = user.total_xp + xpAmount;
        const newDailyXp = dailyXp + xpAmount;
        const newLevel = calculateLevel(newTotalXp);
        const leveledUp = newLevel > user.current_level;

        // Update user
        await pool.query(
            `UPDATE users 
             SET total_xp = $1, daily_xp = $2, current_level = $3, updated_at = NOW()
             WHERE id = $4`,
            [newTotalXp, newDailyXp, newLevel, userId]
        );

        // Log XP history
        await pool.query(
            `INSERT INTO xp_history (user_id, action_type, xp_earned, reference_id) 
             VALUES ($1, $2, $3, $4)`,
            [userId, actionType, xpAmount, referenceId || null]
        );

        console.log(`[XP] User ${userId} earned ${xpAmount} XP for ${actionType}. Total: ${newTotalXp}, Level: ${newLevel}`);

        return {
            success: true,
            newXp: newTotalXp,
            newLevel,
            leveledUp,
            xpEarned: xpAmount
        };
    } catch (error) {
        console.error('[XP] Error awarding XP:', error);
        return { success: false, reason: 'database_error' };
    }
}

/**
 * Get all level definitions
 */
export async function getLevelDefinitions(req: Request, res: Response) {
    try {
        const result = await pool.query(
            'SELECT * FROM level_definitions ORDER BY level ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching level definitions:', error);
        res.status(500).json({ error: 'Failed to fetch level definitions' });
    }
}

/**
 * Get user's level progress
 */
export async function getUserLevelProgress(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.userId;

        const userResult = await pool.query(
            `SELECT current_level, total_xp, daily_xp 
             FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];
        const currentLevelXp = LEVEL_THRESHOLDS.find(l => l.level === user.current_level)?.xp || 0;
        const nextLevelXp = getXPForNextLevel(user.current_level);
        const xpInCurrentLevel = user.total_xp - currentLevelXp;
        const xpNeededForNext = nextLevelXp - currentLevelXp;
        const progressPercentage = (xpInCurrentLevel / xpNeededForNext) * 100;

        res.json({
            currentLevel: user.current_level,
            totalXp: user.total_xp,
            dailyXp: user.daily_xp,
            xpInCurrentLevel,
            xpNeededForNext,
            progressPercentage: Math.min(progressPercentage, 100),
            nextLevel: user.current_level < 10 ? user.current_level + 1 : null
        });
    } catch (error) {
        console.error('Error fetching user level progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
}

/**
 * Get user's XP history
 */
export async function getXPHistory(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.userId;
        const limit = parseInt(req.query.limit as string) || 50;

        const result = await pool.query(
            `SELECT * FROM xp_history 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2`,
            [userId, limit]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching XP history:', error);
        res.status(500).json({ error: 'Failed to fetch XP history' });
    }
}

/**
 * Get exercises for a specific area and level
 */
export async function getExercises(req: Request, res: Response) {
    try {
        const { area } = req.params;
        const userId = (req as any).user?.userId;

        // Get user's level
        const userResult = await pool.query(
            'SELECT current_level FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userLevel = userResult.rows[0].current_level;

        // Get exercises user can access
        const exercisesResult = await pool.query(
            `SELECT e.*, 
                    ec.completed_at,
                    ec.xp_awarded,
                    CASE WHEN ec.id IS NOT NULL THEN true ELSE false END as is_completed
             FROM exercises e
             LEFT JOIN exercise_completions ec ON e.id = ec.exercise_id AND ec.user_id = $1
             WHERE e.area = $2 
               AND e.required_level <= $3
               AND e.is_published = true
             ORDER BY e.required_level ASC, e.created_at ASC`,
            [userId, area, userLevel]
        );

        res.json(exercisesResult.rows);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
}

/**
 * Complete an exercise
 */
export async function completeExercise(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        const { submissionText } = req.body;

        // Check if exercise exists
        const exerciseResult = await pool.query(
            'SELECT * FROM exercises WHERE id = $1',
            [id]
        );

        if (exerciseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        const exercise = exerciseResult.rows[0];

        // Check if already completed
        const completionCheck = await pool.query(
            'SELECT * FROM exercise_completions WHERE user_id = $1 AND exercise_id = $2',
            [userId, id]
        );

        if (completionCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Exercise already completed' });
        }

        // Award XP
        const xpResult = await awardXP(userId, 'exercise_complete', exercise.xp_reward, id);

        if (!xpResult.success) {
            return res.status(400).json({ error: xpResult.reason });
        }

        // Mark as completed
        await pool.query(
            `INSERT INTO exercise_completions (user_id, exercise_id, submission_text, xp_awarded)
             VALUES ($1, $2, $3, $4)`,
            [userId, id, submissionText, exercise.xp_reward]
        );

        res.json({
            success: true,
            xpEarned: xpResult.xpEarned,
            newLevel: xpResult.newLevel,
            leveledUp: xpResult.leveledUp
        });
    } catch (error) {
        console.error('Error completing exercise:', error);
        res.status(500).json({ error: 'Failed to complete exercise' });
    }
}
