-- Migration: Create Live Events Tables
-- Description: Creates tables for live events, registrations, and recordings

-- Tabla de eventos en vivo
CREATE TABLE live_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    area VARCHAR(100) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    zoom_link TEXT,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    is_published BOOLEAN DEFAULT false,
    max_attendees INTEGER,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de registros/asistencia
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    UNIQUE(event_id, user_id)
);

-- Tabla de grabaciones
CREATE TABLE event_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES live_events(id) ON DELETE CASCADE,
    video_provider VARCHAR(50) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_events_scheduled ON live_events(scheduled_at);
CREATE INDEX idx_events_area ON live_events(area);
CREATE INDEX idx_events_published ON live_events(is_published);
CREATE INDEX idx_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_recordings_event ON event_recordings(event_id);

-- Comentarios
COMMENT ON TABLE live_events IS 'Eventos en vivo (directos) programados';
COMMENT ON TABLE event_registrations IS 'Registros de usuarios a eventos';
COMMENT ON TABLE event_recordings IS 'Grabaciones de eventos pasados';
