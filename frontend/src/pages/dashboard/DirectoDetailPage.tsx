import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { FiCalendar, FiClock, FiUsers, FiArrowLeft, FiExternalLink } from 'react-icons/fi';

interface LiveEvent {
    id: string;
    title: string;
    description: string;
    area: string;
    instructor: string;
    zoom_link: string | null;
    scheduled_at: string;
    duration_minutes: number;
    max_attendees: number | null;
    thumbnail_url: string | null;
    attendees_count: number;
    is_registered: boolean;
    recordings?: Array<{
        id: string;
        video_provider: string;
        video_id: string;
        duration_minutes: number;
    }>;
}

const areaNames: Record<string, string> = {
    elsenderodelyo: 'Sendero del Yo',
    finanzasparaunavidalibre: 'Finanzas Conscientes',
    dialogosdeldharma: 'Diálogos del Dharma',
    elartedehabitar: 'Arte de Habitar',
    templodeexpresionyencuentro: 'Templo de Expresión',
    elcaminodelbienestar: 'Camino del Bienestar',
    relacionesenarmonia: 'Relaciones en Armonía',
    cuerpoplaceryconexion: 'Cuerpo y Placer',
};

export default function DirectoDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<LiveEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/live-events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!event) return;

        setRegistering(true);
        try {
            await api.post(`/live-events/${id}/register`);
            // Refresh event to get updated registration status and zoom link
            await fetchEvent();
        } catch (error: any) {
            console.error('Error registering:', error);
            alert(error.response?.data?.error || 'Error al registrarse');
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async () => {
        if (!event) return;
        if (!confirm('¿Estás seguro de que quieres cancelar tu registro?')) return;

        setRegistering(true);
        try {
            await api.delete(`/live-events/${id}/register`);
            await fetchEvent();
        } catch (error: any) {
            console.error('Error unregistering:', error);
            alert(error.response?.data?.error || 'Error al cancelar registro');
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPast = event && new Date(event.scheduled_at) < new Date();
    const hasActiveMembership = user?.membershipStatus === 'active';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-asparragus/60 mb-4">Evento no encontrado</p>
                <Link
                    to="/dashboard/directos"
                    className="text-gold hover:underline"
                >
                    Volver a Directos
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Helmet>
                    <title>{event.title} | Dharma en Ruta</title>
                </Helmet>

                {/* Back button */}
                <button
                    onClick={() => navigate('/dashboard/directos')}
                    className="flex items-center gap-2 text-asparragus/60 hover:text-asparragus transition-colors"
                >
                    <FiArrowLeft />
                    <span>Volver a Directos</span>
                </button>

                {/* Event header */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-gold/10 to-gold/5">
                        {event.thumbnail_url ? (
                            <img
                                src={event.thumbnail_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="img/Backgrounds/background3.jpg"
                                alt="Dharma en Ruta"
                                className="w-full h-full object-cover opacity-40"
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Title and area */}
                        <div>
                            <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium mb-3">
                                {areaNames[event.area] || event.area}
                            </span>
                            <h1 className="font-gotu text-3xl text-asparragus mb-2">
                                {event.title}
                            </h1>
                            <p className="text-asparragus/70">
                                Con <span className="font-medium text-asparragus">{event.instructor}</span>
                            </p>
                        </div>

                        {/* Event details */}
                        <div className="grid md:grid-cols-3 gap-4 py-4 border-y border-stone-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <FiCalendar className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <p className="text-xs text-asparragus/60">Fecha</p>
                                    <p className="text-sm font-medium text-asparragus capitalize">
                                        {formatDate(event.scheduled_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <FiClock className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <p className="text-xs text-asparragus/60">Hora</p>
                                    <p className="text-sm font-medium text-asparragus">
                                        {formatTime(event.scheduled_at)} • {event.duration_minutes} min
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <FiUsers className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <p className="text-xs text-asparragus/60">Asistentes</p>
                                    <p className="text-sm font-medium text-asparragus">
                                        {event.attendees_count}
                                        {event.max_attendees && ` / ${event.max_attendees}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="font-gotu text-xl text-asparragus mb-3">Descripción</h2>
                            <p className="text-asparragus/70 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        {/* Registration / Zoom link */}
                        {!isPast && (
                            <div className="bg-gold/5 rounded-lg p-6 space-y-4">
                                {event.is_registered ? (
                                    <>
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <span className="text-lg">✓</span>
                                            <span className="font-medium">Estás registrado en este evento</span>
                                        </div>

                                        {event.zoom_link && hasActiveMembership ? (
                                            <div>
                                                <p className="text-sm text-asparragus/70 mb-3">
                                                    Únete al evento usando el siguiente enlace:
                                                </p>
                                                <a
                                                    href={event.zoom_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
                                                >
                                                    <span>Unirse a Zoom</span>
                                                    <FiExternalLink />
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-asparragus/60">
                                                El enlace de Zoom estará disponible próximamente
                                            </p>
                                        )}

                                        <button
                                            onClick={handleUnregister}
                                            disabled={registering}
                                            className="text-sm text-asparragus/60 hover:text-asparragus underline disabled:opacity-50"
                                        >
                                            Cancelar registro
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {hasActiveMembership ? (
                                            <>
                                                <p className="text-asparragus/70">
                                                    Regístrate para recibir el enlace de Zoom
                                                </p>
                                                <button
                                                    onClick={handleRegister}
                                                    disabled={registering}
                                                    className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium disabled:opacity-50"
                                                >
                                                    {registering ? 'Registrando...' : 'Registrarme'}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-asparragus/70 mb-4">
                                                    Se requiere membresía activa para registrarse
                                                </p>
                                                <Link
                                                    to="/dashboard/perfil"
                                                    className="inline-block px-6 py-3 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors font-medium"
                                                >
                                                    Ver membresía
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Recordings for past events */}
                        {isPast && event.recordings && event.recordings.length > 0 && (
                            <div>
                                <h2 className="font-gotu text-xl text-asparragus mb-4">Grabación</h2>
                                {event.recordings.map((recording) => (
                                    <div key={recording.id} className="aspect-video bg-black rounded-lg overflow-hidden">
                                        <iframe
                                            src={
                                                recording.video_provider === 'youtube'
                                                    ? `https://www.youtube.com/embed/${recording.video_id}`
                                                    : `https://player.vimeo.com/video/${recording.video_id}`
                                            }
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
