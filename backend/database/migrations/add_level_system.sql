-- Migration: Add Level System
-- Created: 2025-12-12
-- Purpose: Implement progressive level system with XP, exercises, and content unlocking

-- ============================================
-- 1. Add level fields to users table
-- ============================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_xp_reset_date DATE DEFAULT CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_users_level ON users(current_level);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(total_xp);

-- ============================================
-- 2. Add level requirements to videos
-- ============================================
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS required_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS content_tier VARCHAR(20) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 10;

CREATE INDEX IF NOT EXISTS idx_videos_level ON videos(required_level);
CREATE INDEX IF NOT EXISTS idx_videos_tier ON videos(content_tier);

-- ============================================
-- 3. Create level definitions table
-- ============================================
CREATE TABLE IF NOT EXISTS level_definitions (
  level INTEGER PRIMARY KEY,
  level_name VARCHAR(50) NOT NULL,
  xp_required INTEGER NOT NULL,
  badge_icon VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial level definitions (easily editable)
INSERT INTO level_definitions (level, level_name, xp_required, description) VALUES
(1, 'Iniciado', 0, 'Bienvenido al camino del Dharma'),
(2, 'Explorador', 100, 'Comenzando a explorar las áreas'),
(3, 'Aprendiz', 250, 'Aprendiendo los fundamentos'),
(4, 'Practicante', 500, 'Practicando regularmente'),
(5, 'Conocedor', 1000, 'Conocimiento sólido de las bases'),
(6, 'Sabio', 1750, 'Sabiduría en múltiples áreas'),
(7, 'Maestro', 2750, 'Maestría en el camino'),
(8, 'Guía', 4000, 'Guiando tu propia transformación'),
(9, 'Iluminado', 6000, 'Iluminación en progreso'),
(10, 'Dharma', 10000, 'Viviendo el Dharma plenamente')
ON CONFLICT (level) DO NOTHING;

-- ============================================
-- 4. Create XP history table
-- ============================================
CREATE TABLE IF NOT EXISTS xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'video_complete', 'exercise_complete', 'live_attend', 'community_post', etc.
  xp_earned INTEGER NOT NULL,
  reference_id UUID, -- ID of video, exercise, post, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_user ON xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_date ON xp_history(created_at);
CREATE INDEX IF NOT EXISTS idx_xp_action ON xp_history(action_type);

-- ============================================
-- 5. Create exercises table (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  area VARCHAR(100) NOT NULL,
  required_level INTEGER DEFAULT 1,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL, -- Optional: linked to a video
  exercise_type VARCHAR(50) DEFAULT 'reflection', -- 'reflection', 'practice', 'journal', 'meditation'
  instructions TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 20,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_area ON exercises(area);
CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises(required_level);
CREATE INDEX IF NOT EXISTS idx_exercises_video ON exercises(video_id);

-- ============================================
-- 6. Create exercise completions table
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  submission_text TEXT, -- User's response/reflection
  completed_at TIMESTAMP DEFAULT NOW(),
  xp_awarded INTEGER,
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON exercise_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_exercise ON exercise_completions(exercise_id);

-- ============================================
-- 7. Add comments for documentation
-- ============================================
COMMENT ON COLUMN users.current_level IS 'User current level (1-10)';
COMMENT ON COLUMN users.total_xp IS 'Total XP accumulated across all time';
COMMENT ON COLUMN users.daily_xp IS 'XP earned today (resets daily)';
COMMENT ON COLUMN users.last_xp_reset_date IS 'Last date when daily XP was reset';

COMMENT ON TABLE level_definitions IS 'Defines level names, XP requirements, and descriptions (easily editable)';
COMMENT ON TABLE xp_history IS 'Complete history of all XP earned for auditing and analytics';
COMMENT ON TABLE exercises IS 'Practical exercises for each area and level';
COMMENT ON TABLE exercise_completions IS 'Tracks which exercises users have completed';
