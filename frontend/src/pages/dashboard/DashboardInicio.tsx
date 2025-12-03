// frontend/src/pages/dashboard/DashboardInicio.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiVideo, FiCalendar, FiUsers, FiTrendingUp, FiPlay, FiClock } from 'react-icons/fi';
import { api } from '../../lib/api';

interface Video {
    id: string;
    title: string;
    area: string;
    thumbnail_url?: string;
    watched_seconds?: number;
    total_seconds?: number;
}

interface Reservation {
    id: string;
    fecha: string;
    hora: string;
    acompanante: string;
    estado: string;
}

interface LiveEvent {
    id: string;
    title: string;
    instructor: string;
    scheduled_at: string;
    duration_minutes: number;
    area: string;
}

export default function DashboardInicio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lastVideo, setLastVideo] = useState<Video | null>(null);
    const [nextReservation, setNextReservation] = useState<Reservation | null>(null);
    const [nextEvent, setNextEvent] = useState<LiveEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('[DASHBOARD] Fetching dashboard data...');

                // Fetch last watched video
                const videoResponse = await api.get('/contenidos/last-watched');
                console.log('[DASHBOARD] Last watched video response:', videoResponse.data);
                if (videoResponse.data) {
                    setLastVideo(videoResponse.data);
                }

                // Fetch upcoming reservations
                const reservasResponse = await api.get('/reservas/mis-reservas');
                console.log('[DASHBOARD] Reservations response:', reservasResponse.data);
                if (reservasResponse.data.upcoming && reservasResponse.data.upcoming.length > 0) {
                    setNextReservation(reservasResponse.data.upcoming[0]);
                }

                // Fetch next registered live event
                const eventsResponse = await api.get('/live-events/my-registrations');
                console.log('[DASHBOARD] My events response:', eventsResponse.data);
                if (eventsResponse.data && eventsResponse.data.length > 0) {
                    setNextEvent(eventsResponse.data[0]);
                }
            } catch (error) {
                console.error('[DASHBOARD] Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getProgressPercentage = (watched: number, total: number) => {
        if (!total) return 0;
        return Math.min(Math.round((watched / total) * 100), 100);
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-3xl font-gotu text-asparragus mb-2">
                    ¡Hola, {user?.nombre}! 👋
                </h1>
                <p className="text-asparragus/70">
                    Bienvenido a tu área de miembros de Dharma en Ruta
                </p>
            </div>

            {/* Membership status card */}
            <div className="bg-gradient-to-br from-asparragus to-asparragus/80 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-gotu mb-2">Estado de membresía</h2>
                        <p className="text-white/90 mb-4">
                            {user?.membershipStatus === 'active' ? 'Tu membresía está activa' : 'Membresía inactiva'}
                        </p>
                        {user?.membershipStatus !== 'active' && (
                            <Link
                                to="/registro"
                                className="inline-block bg-white text-asparragus px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                            >
                                Activar membresía
                            </Link>
                        )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${user?.membershipStatus === 'active' ? 'bg-green-500' : 'bg-white/20'
                        }`}>
                        {user?.membershipStatus === 'active' ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
            </div>

            {/* Quick access grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    to="/dashboard/contenidos"
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 bg-asparragus/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-asparragus/20 transition-colors">
                        <FiVideo className="w-6 h-6 text-asparragus" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Contenidos</h3>
                    <p className="text-sm text-asparragus/60">Explora la biblioteca</p>
                </Link>

                <Link
                    to="/dashboard/reservas"
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                        <FiCalendar className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Mis Reservas</h3>
                    <p className="text-sm text-asparragus/60">Ver sesiones</p>
                </Link>

                <div className="bg-white rounded-xl p-6 opacity-60">
                    <div className="w-12 h-12 bg-raw/10 rounded-lg flex items-center justify-center mb-4">
                        <FiUsers className="w-6 h-6 text-raw" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Comunidad</h3>
                    <p className="text-sm text-asparragus/60">Próximamente</p>
                </div>

                <Link to="/dashboard/directos" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                        <FiTrendingUp className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Directos</h3>
                    <p className="text-sm text-asparragus/60">Sesiones en vivo</p>
                </Link>
            </div>

            {/* Content sections */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Continúa donde lo dejaste */}
                <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-gotu text-lg text-asparragus mb-4">Continúa donde lo dejaste</h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asparragus"></div>
                        </div>
                    ) : lastVideo ? (
                        <div
                            onClick={() => navigate(`/dashboard/contenidos/${lastVideo.id}`)}
                            className="cursor-pointer group"
                        >
                            <div className="relative aspect-video bg-gradient-to-br from-asparragus/10 to-asparragus/5 rounded-lg mb-3 overflow-hidden">
                                {lastVideo.thumbnail_url ? (
                                    <img
                                        src={lastVideo.thumbnail_url}
                                        alt={lastVideo.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <FiVideo className="w-12 h-12 text-asparragus/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FiPlay className="w-6 h-6 text-asparragus ml-1" />
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-medium text-asparragus mb-1 group-hover:text-asparragus/80 transition-colors">
                                {lastVideo.title}
                            </h4>
                            <p className="text-sm text-asparragus/60 mb-3">{lastVideo.area}</p>

                            {/* Progress bar */}
                            {lastVideo.watched_seconds && lastVideo.total_seconds && (
                                <div>
                                    <div className="flex items-center justify-between text-xs text-asparragus/60 mb-1">
                                        <span>Progreso</span>
                                        <span>{getProgressPercentage(lastVideo.watched_seconds, lastVideo.total_seconds)}%</span>
                                    </div>
                                    <div className="w-full bg-asparragus/10 rounded-full h-2">
                                        <div
                                            className="bg-asparragus h-2 rounded-full transition-all"
                                            style={{ width: `${getProgressPercentage(lastVideo.watched_seconds, lastVideo.total_seconds)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FiVideo className="w-12 h-12 text-asparragus/20 mx-auto mb-3" />
                            <p className="text-sm text-asparragus/60 mb-4">
                                Aún no has empezado a ver ningún vídeo
                            </p>
                            <Link
                                to="/dashboard/contenidos"
                                className="inline-block px-4 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors text-sm"
                            >
                                Explorar contenidos
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right column: Próximo Directo + Próximas Sesiones */}
                <div className="space-y-6">
                    {/* Próximo Directo */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-gotu text-lg text-asparragus mb-4">Próximo Directo</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                            </div>
                        ) : nextEvent ? (
                            <Link
                                to={`/dashboard/directos/${nextEvent.id}`}
                                className="block border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiCalendar className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-asparragus mb-1">
                                            {nextEvent.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-asparragus/70 mb-2">
                                            <FiCalendar className="w-4 h-4" />
                                            <span className="capitalize">{formatDate(nextEvent.scheduled_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-asparragus/70">
                                            <FiClock className="w-4 h-4" />
                                            <span>{new Date(nextEvent.scheduled_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • {nextEvent.duration_minutes} min</span>
                                        </div>
                                        <p className="text-sm text-asparragus/60 mt-2">
                                            Con <span className="font-medium text-asparragus">{nextEvent.instructor}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="text-center py-8">
                                <FiCalendar className="w-12 h-12 text-gold/20 mx-auto mb-3" />
                                <p className="text-sm text-asparragus/60 mb-4">
                                    No estás registrado en ningún directo
                                </p>
                                <Link
                                    to="/dashboard/directos"
                                    className="inline-block px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors text-sm"
                                >
                                    Ver directos
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Próximas sesiones */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-gotu text-lg text-asparragus mb-4">Próximas sesiones</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                            </div>
                        ) : nextReservation ? (
                            <div className="border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiCalendar className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-asparragus mb-1">
                                            Sesión con {nextReservation.acompanante}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-asparragus/70 mb-2">
                                            <FiCalendar className="w-4 h-4" />
                                            <span className="capitalize">{formatDate(nextReservation.fecha)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-asparragus/70">
                                            <FiClock className="w-4 h-4" />
                                            <span>{nextReservation.hora}</span>
                                        </div>
                                        <div className="mt-3">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${nextReservation.estado === 'pagada'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {nextReservation.estado === 'pagada' ? 'Confirmada' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard/reservas"
                                    className="block mt-4 text-center px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors text-sm font-medium"
                                >
                                    Ver todas mis reservas
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FiCalendar className="w-12 h-12 text-gold/20 mx-auto mb-3" />
                                <p className="text-sm text-asparragus/60 mb-4">
                                    No tienes sesiones programadas
                                </p>
                                <a
                                    href="/acompanamientos"
                                    className="inline-block px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors text-sm"
                                >
                                    Reservar sesión
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
