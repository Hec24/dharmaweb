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
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchEvents();
    }, [activeTab, selectedArea, debouncedSearch]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'upcoming'
                ? '/live-events/upcoming'
                : '/live-events/past';

            const params = selectedArea ? { area: selectedArea } : {};
            if (debouncedSearch) {
                (params as any).search = debouncedSearch;
            }
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
                        src="/img/Backgrounds/background2.jpg"
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
                <h3 className="font-serif text-lg text-stone-800 mb-2 line-clamp-2">
                    {event.title}
                </h3>

                <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 text-sm text-stone-500">
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

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                    <span className="text-asparragus font-medium text-sm">
                        {activeTab === 'upcoming' ? 'Ver detalles →' : 'Ver grabación →'}
                    </span>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="space-y-8">
            <Helmet>
                <title>Directos | Dharma en Ruta</title>
            </Helmet>

            {/* Header */}
            <div className="bg-white p-6 rounded-t-none rounded-b-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                {/* Background image with overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'url(/img/Backgrounds/background4.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl text-stone-800 mb-2">Directos</h1>
                        <p className="text-stone-500 text-sm">
                            Sesiones en vivo con la comunidad
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Buscar directos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 focus:border-asparragus text-sm"
                        />
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'upcoming'
                        ? 'text-asparragus border-b-2 border-asparragus'
                        : 'text-stone-500 hover:text-stone-700'
                        }`}
                >
                    Próximos ({upcomingEvents.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'past'
                        ? 'text-asparragus border-b-2 border-asparragus'
                        : 'text-stone-500 hover:text-stone-700'
                        }`}
                >
                    Grabaciones ({pastEvents.length})
                </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
                {/* Area Filter Dropdown */}
                <div className="mb-6">
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-asparragus/20 focus:border-asparragus bg-white"
                    >
                        <option value="">Todas las áreas</option>
                        {Object.entries(areaNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white rounded-xl h-80 shadow-sm"></div>
                        ))}
                    </div>
                ) : activeTab === 'upcoming' ? (
                    upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                            <FiCalendar className="mx-auto text-4xl text-stone-300 mb-4" />
                            <p className="text-stone-500">No hay eventos próximos</p>
                        </div>
                    )
                ) : (
                    pastEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                            <FiPlay className="mx-auto text-4xl text-stone-300 mb-4" />
                            <p className="text-stone-500">No hay grabaciones disponibles</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
