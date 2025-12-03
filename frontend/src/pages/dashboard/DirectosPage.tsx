import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../lib/api';
import { FiCalendar, FiClock, FiUsers, FiPlay } from 'react-icons/fi';

interface LiveEvent {
    id: string;
    title: string;
    description: string;
    area: string;
    instructor: string;
    scheduled_at: string;
    duration_minutes: number;
    max_attendees: number | null;
    thumbnail_url: string | null;
    attendees_count: number;
    is_registered: boolean;
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

export default function DirectosPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [upcomingEvents, setUpcomingEvents] = useState<LiveEvent[]>([]);
    const [pastEvents, setPastEvents] = useState<LiveEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState<string>('');

    useEffect(() => {
        fetchEvents();
    }, [activeTab, selectedArea]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'upcoming'
                ? '/live-events/upcoming'
                : '/live-events/past';

            const params = selectedArea ? { area: selectedArea } : {};
            const response = await api.get(endpoint, { params });

            if (activeTab === 'upcoming') {
                setUpcomingEvents(response.data);
            } else {
                setPastEvents(response.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
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

    const EventCard = ({ event }: { event: LiveEvent }) => (
        <Link
            to={`/dashboard/directos/${event.id}`}
            className="block bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow"
        >
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

                {/* Area badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-asparragus">
                        {areaNames[event.area] || event.area}
                    </span>
                </div>

                {/* Registered badge */}
                {event.is_registered && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-block px-3 py-1 bg-gold/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            ✓ Registrado
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-gotu text-lg text-asparragus mb-2 line-clamp-2">
                    {event.title}
                </h3>

                <p className="text-sm text-asparragus/70 mb-3 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 text-sm text-asparragus/60">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <span className="capitalize">{formatDate(event.scheduled_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>{formatTime(event.scheduled_at)} • {event.duration_minutes} min</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        <span>
                            {event.attendees_count} asistente{event.attendees_count !== 1 ? 's' : ''}
                            {event.max_attendees && ` / ${event.max_attendees}`}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100">
                    <p className="text-sm text-asparragus/60">
                        Con <span className="font-medium text-asparragus">{event.instructor}</span>
                    </p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <Helmet>
                <title>Directos | Dharma en Ruta</title>
            </Helmet>

            {/* Header */}
            <div>
                <h1 className="font-gotu text-3xl text-asparragus mb-2">Directos</h1>
                <p className="text-asparragus/70">
                    Sesiones en vivo con la comunidad
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'upcoming'
                        ? 'text-gold'
                        : 'text-asparragus/50 hover:text-asparragus/70'
                        }`}
                >
                    Próximos
                    {activeTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'past'
                        ? 'text-gold'
                        : 'text-asparragus/50 hover:text-asparragus/70'
                        }`}
                >
                    Archivo
                    {activeTab === 'past' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                    )}
                </button>
            </div>

            {/* Filter by area */}
            <div>
                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-asparragus focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                    <option value="">Todas las áreas</option>
                    {Object.entries(areaNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Events grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'upcoming' ? (
                        upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FiCalendar className="w-16 h-16 text-gold/20 mx-auto mb-4" />
                                <p className="text-asparragus/60 mb-2">
                                    No hay eventos próximos
                                </p>
                                <p className="text-sm text-asparragus/50">
                                    Vuelve pronto para ver nuevas sesiones
                                </p>
                            </div>
                        )
                    ) : (
                        pastEvents.length > 0 ? (
                            pastEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FiPlay className="w-16 h-16 text-gold/20 mx-auto mb-4" />
                                <p className="text-asparragus/60 mb-2">
                                    No hay grabaciones disponibles
                                </p>
                                <p className="text-sm text-asparragus/50">
                                    Las grabaciones de eventos pasados aparecerán aquí
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
