-- Migration: Create Event Questions Tables
-- Description: Creates table for pre-event question submissions

-- Tabla de preguntas para eventos
CREATE TABLE IF NOT EXISTS event_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'featured')),
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de votos de preguntas (para evitar votos duplicados)
CREATE TABLE IF NOT EXISTS question_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES event_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(question_id, user_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_questions_event ON event_questions(event_id);
CREATE INDEX IF NOT EXISTS idx_questions_user ON event_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON event_questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON event_questions(votes DESC);
CREATE INDEX IF NOT EXISTS idx_question_votes_question ON question_votes(question_id);
CREATE INDEX IF NOT EXISTS idx_question_votes_user ON question_votes(user_id);

-- Comentarios
COMMENT ON TABLE event_questions IS 'Preguntas enviadas por usuarios para eventos en vivo';
COMMENT ON TABLE question_votes IS 'Votos de usuarios en preguntas';
COMMENT ON COLUMN event_questions.status IS 'Estado: pending, answered, featured';
COMMENT ON COLUMN event_questions.votes IS 'Contador de votos (desnormalizado para rendimiento)';
