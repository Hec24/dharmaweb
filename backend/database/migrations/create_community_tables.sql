-- Migration: Create Community Tables
-- Description: Creates tables for community posts, comments, and content reports

-- Tabla de posts de la comunidad
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    area VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de reportes de contenido inapropiado
CREATE TABLE IF NOT EXISTS community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_item_type VARCHAR(20) NOT NULL CHECK (reported_item_type IN ('post', 'comment')),
    reported_item_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_posts_area ON community_posts(area);
CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON community_posts(is_pinned);

CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON community_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON community_reports(reporter_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created ON community_reports(created_at DESC);

-- Comentarios
COMMENT ON TABLE community_posts IS 'Posts del foro de la comunidad organizados por áreas';
COMMENT ON TABLE community_comments IS 'Comentarios en posts de la comunidad';
COMMENT ON TABLE community_reports IS 'Reportes de contenido inapropiado';
