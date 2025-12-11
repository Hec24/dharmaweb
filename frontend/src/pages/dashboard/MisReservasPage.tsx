import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendar, FaClock, FaUser, FaCheckCircle, FaTimesCircle, FaDownload, FaSearch } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface Reserva {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    acompanante: string;
    acompanante_email: string;
    fecha: string;
    hora: string;
    duracion_min: number;
    estado: 'pendiente' | 'pagada' | 'cancelada' | 'completada';
    event_id?: string;
    created_at: string;
}

const MisReservasPage: React.FC = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [upcoming, setUpcoming] = useState<Reserva[]>([]);
    const [past, setPast] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);
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
        fetchReservations();
    }, [token, debouncedSearch]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/reservas/mis-reservas`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                let upcomingData = data.upcoming;
                let pastData = data.past;

                // Filter by search term if present
                if (debouncedSearch) {
                    const searchLower = debouncedSearch.toLowerCase();
                    upcomingData = upcomingData.filter((r: Reserva) =>
                        r.acompanante.toLowerCase().includes(searchLower) ||
                        r.fecha.includes(searchLower)
                    );
                    pastData = pastData.filter((r: Reserva) =>
                        r.acompanante.toLowerCase().includes(searchLower) ||
                        r.fecha.includes(searchLower)
                    );
                }

                setUpcoming(upcomingData);
                setPast(pastData);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?\n\nPolítica de cancelación:\n- Más de 24h: Reembolso completo\n- Menos de 24h: Sin reembolso')) {
            return;
        }

        setCancelling(id);
        try {
            const response = await fetch(`${BACKEND_URL}/api/reservas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.canRefund
                    ? 'Reserva cancelada. Se procesará el reembolso en 5-10 días hábiles.'
                    : 'Reserva cancelada. No se aplicará reembolso (menos de 24h de antelación).'
                );
                fetchReservations(); // Refresh list
            } else {
                const error = await response.json();
                alert(error.error || 'Error al cancelar la reserva');
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Error al cancelar la reserva');
        } finally {
            setCancelling(null);
        }
    };

    const formatDate = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (hora: string) => {
        return hora.substring(0, 5); // HH:MM
    };

    const downloadICS = (reserva: Reserva) => {
        // Crear fecha y hora en formato iCalendar
        const startDate = new Date(`${reserva.fecha}T${reserva.hora}`);
        const endDate = new Date(startDate.getTime() + reserva.duracion_min * 60000);

        // Formato: YYYYMMDDTHHMMSS
        const formatICSDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}T${hours}${minutes}${seconds}`;
        };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Dharma en Ruta//ES',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${reserva.id}@dharmaenruta.com`,
            `DTSTAMP:${formatICSDate(new Date())}`,
            `DTSTART:${formatICSDate(startDate)}`,
            `DTEND:${formatICSDate(endDate)}`,
            `SUMMARY:Sesión de acompañamiento con ${reserva.acompanante}`,
            `DESCRIPTION:Sesión de acompañamiento personalizado\\n\\nDuración: ${reserva.duracion_min} minutos\\nEstado: ${reserva.estado}`,
            `LOCATION:Online`,
            `STATUS:CONFIRMED`,
            `ORGANIZER;CN=${reserva.acompanante}:mailto:${reserva.acompanante_email}`,
            `ATTENDEE;CN=${reserva.nombre} ${reserva.apellidos}:mailto:${reserva.email}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        // Crear blob y descargar
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reserva-${reserva.fecha}-${reserva.acompanante.replace(/\s+/g, '-')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const getEstadoBadge = (estado: string) => {
        const badges = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            pagada: 'bg-green-100 text-green-800',
            cancelada: 'bg-red-100 text-red-800',
            completada: 'bg-blue-100 text-blue-800'
        };
        const labels = {
            pendiente: 'Pendiente',
            pagada: 'Confirmada',
            cancelada: 'Cancelada',
            completada: 'Completada'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[estado as keyof typeof badges]}`}>
                {labels[estado as keyof typeof labels]}
            </span>
        );
    };

    const ReservaCard: React.FC<{ reserva: Reserva; isUpcoming: boolean }> = ({ reserva, isUpcoming }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <FaCalendar className="text-asparragus" />
                        <span className="font-medium text-stone-800">
                            {formatDate(reserva.fecha)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                        <FaClock size={14} />
                        <span>{formatTime(reserva.hora)} ({reserva.duracion_min} min)</span>
                    </div>
                </div>
                {getEstadoBadge(reserva.estado)}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-stone-700">
                    <FaUser size={14} className="text-asparragus" />
                    <span className="font-medium">{reserva.acompanante}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-stone-100">
                {isUpcoming && reserva.estado?.toLowerCase() === 'pagada' && (
                    <>
                        <button
                            onClick={() => alert('Funcionalidad de reprogramar próximamente')}
                            className="flex items-center gap-2 px-4 py-2 text-asparragus hover:bg-asparragus/5 rounded-lg transition-colors"
                        >
                            <FaCalendar />
                            Reprogramar
                        </button>
                        <button
                            onClick={() => handleCancel(reserva.id)}
                            disabled={cancelling === reserva.id}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <FaTimesCircle />
                            {cancelling === reserva.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                    </>
                )}
                {isUpcoming && reserva.estado === 'pendiente' && (
                    <span className="text-yellow-600 text-sm flex items-center">
                        Pendiente de pago
                    </span>
                )}
                <button
                    onClick={() => downloadICS(reserva)}
                    className="flex items-center gap-2 px-4 py-2 text-asparragus hover:bg-asparragus/5 rounded-lg transition-colors ml-auto"
                >
                    <FaDownload />
                    Descargar .ics
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <Helmet>
                <title>Mis Reservas | Dharma en Ruta</title>
            </Helmet>

            {/* Header */}
            <div className="bg-white p-6 rounded-t-none rounded-b-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                {/* Background image with overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'url(/img/Backgrounds/tinified/background4.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl text-stone-800 mb-2">Mis Reservas</h1>
                        <p className="text-stone-500 text-sm">Gestiona tus sesiones de acompañamiento</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Buscar reservas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 focus:border-asparragus text-sm"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                        </div>

                        <a
                            href="/acompanamientos"
                            className="px-6 py-3 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors font-medium whitespace-nowrap"
                        >
                            Nueva Reserva
                        </a>
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
                    Próximas ({upcoming.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'past'
                        ? 'text-asparragus border-b-2 border-asparragus'
                        : 'text-stone-500 hover:text-stone-700'
                        }`}
                >
                    Historial ({past.length})
                </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                        {[1, 2].map((n) => (
                            <div key={n} className="bg-white rounded-xl h-48 shadow-sm"></div>
                        ))}
                    </div>
                ) : activeTab === 'upcoming' ? (
                    upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcoming.map((reserva) => (
                                <ReservaCard key={reserva.id} reserva={reserva} isUpcoming={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                            <FaCalendar className="mx-auto text-4xl text-stone-300 mb-4" />
                            <p className="text-stone-500 mb-4">No tienes reservas próximas</p>
                            <a
                                href="/acompanamientos"
                                className="inline-block px-6 py-3 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors"
                            >
                                Reservar sesión
                            </a>
                        </div>
                    )
                ) : (
                    past.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {past.map((reserva) => (
                                <ReservaCard key={reserva.id} reserva={reserva} isUpcoming={false} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                            <p className="text-stone-500">No tienes reservas pasadas</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MisReservasPage;
