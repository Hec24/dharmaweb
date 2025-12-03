-- Migration: Create Community Resources Tables
-- Description: Creates table for featured resources and guides

-- Tabla de recursos de la comunidad
CREATE TABLE IF NOT EXISTS community_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('pdf', 'link', 'guide', 'video', 'article')),
    url TEXT NOT NULL,
    area VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_resources_area ON community_resources(area);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON community_resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_resources_created ON community_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_type ON community_resources(resource_type);

-- Comentarios
COMMENT ON TABLE community_resources IS 'Recursos destacados y guías para la comunidad';
COMMENT ON COLUMN community_resources.resource_type IS 'Tipo de recurso: pdf, link, guide, video, article';
COMMENT ON COLUMN community_resources.is_featured IS 'Si el recurso está destacado/fijado';
