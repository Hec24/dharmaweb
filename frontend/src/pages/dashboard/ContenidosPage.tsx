import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Video } from '../../data/types';
import { VideoCard } from '../../components/dashboard/VideoCard';
import { FaSearch, FaLock } from 'react-icons/fa';
import LevelBadge from '../../components/levels/LevelBadge';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const areas = [
    { id: 'all', label: 'Todas las áreas' },
    { id: 'elsenderodelyo', label: 'Sendero del Yo' },
    { id: 'finanzasparaunavidalibre', label: 'Finanzas Conscientes' },
    { id: 'dialogosdeldharma', label: 'Diálogos del Dharma' },
    { id: 'elartedehabitar', label: 'Arte de Habitar' },
    { id: 'templodeexpresionyencuentro', label: 'Templo de Expresión' },
    { id: 'elcaminodelbienestar', label: 'Camino del Bienestar' },
    { id: 'relacionesenarmonia', label: 'Relaciones en Armonía' },
    { id: 'cuerpoplaceryconexion', label: 'Cuerpo y Placer' },
];

const ContenidosPage: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState('all');
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
        fetchVideos();
    }, [selectedArea, debouncedSearch, token]); // Re-fetch when area or search changes

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedArea !== 'all') params.append('area', selectedArea);
            if (debouncedSearch) params.append('search', debouncedSearch);

            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${BACKEND_URL}/api/contenidos?${params.toString()}`, {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                setVideos(data.videos);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (video: Video) => {
        // Check if video is locked
        const userLevel = user?.current_level || 1;
        const requiredLevel = (video as any).required_level || 1;

        if (requiredLevel > userLevel) {
            // Video is locked, don't navigate
            return;
        }

        navigate(`/dashboard/contenidos/${video.id}`, {
            state: { from: '/dashboard/contenidos' }
        });
    };

    // Filter videos by level (only if level system is active)
    const userLevel = user?.current_level ?? 1;
    const availableVideos = user?.current_level !== undefined
        ? videos.filter(v => ((v as any).required_level || 1) <= userLevel)
        : videos; // Show all videos if level system not active yet
    const lockedVideos = user?.current_level !== undefined
        ? videos.filter(v => ((v as any).required_level || 1) > userLevel)
        : []; // No locked videos if level system not active yet

    // Si el usuario no tiene membresía activa ni acceso MVP, mostrar estado bloqueado
    if (user?.membershipStatus !== 'active' && user?.membershipStatus !== 'mvp_only' && !user?.isMember) {
        return (
            <div className="space-y-8">
                <Helmet>
                    <title>Biblioteca de Contenidos | Dharma en Ruta</title>
                </Helmet>

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
                    <div className="relative z-10">
                        <h1 className="font-serif text-2xl text-stone-800 mb-2">Biblioteca de Contenidos</h1>
                        <p className="text-stone-500 text-sm">Explora recursos para tu crecimiento</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="font-serif text-2xl text-stone-800 mb-4">Contenido Exclusivo para Miembros</h2>
                        <p className="text-stone-600 mb-8 leading-relaxed">
                            Esta sección está reservada para miembros activos de la comunidad Dharma en Ruta.
                            Activa tu membresía para acceder a cientos de vídeos, meditaciones y recursos exclusivos.
                        </p>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-3 bg-asparragus text-white font-medium rounded-lg hover:bg-asparragus/90 transition-colors shadow-sm hover:shadow-md"
                        >
                            Activar Membresía
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Helmet>
                <title>Biblioteca de Contenidos | Dharma en Ruta</title>
            </Helmet>

            {/* Header & Filters */}
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
                        <h1 className="font-serif text-2xl text-stone-800 mb-2">Biblioteca de Contenidos</h1>
                        <p className="text-stone-500 text-sm">Explora recursos para tu crecimiento</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Buscar vídeo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 focus:border-asparragus text-sm"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="px-6 pb-8">
                {/* Area Filter Dropdown */}
                <div className="mb-6">
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value === 'all' ? '' : e.target.value)}
                        className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-asparragus/20 focus:border-asparragus bg-white"
                    >
                        {areas.map((area) => (
                            <option key={area.id} value={area.id === 'all' ? '' : area.id}>
                                {area.label}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-xl h-64 shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Available Videos */}
                        {availableVideos.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-stone-800 mb-4">
                                    Contenido Disponible ({availableVideos.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableVideos.map((video) => (
                                        <VideoCard
                                            key={video.id}
                                            video={video}
                                            onClick={handleVideoClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Locked Videos */}
                        {lockedVideos.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FaLock className="text-stone-400" />
                                    <h2 className="text-lg font-semibold text-stone-800">
                                        Contenido Bloqueado ({lockedVideos.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {lockedVideos.map((video) => (
                                        <div
                                            key={video.id}
                                            className="relative bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden opacity-60 cursor-not-allowed"
                                        >
                                            <VideoCard
                                                video={video}
                                                onClick={() => { }} // No action for locked videos
                                            />
                                            {/* Lock overlay */}
                                            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                                                <div className="bg-white/90 rounded-full p-4 mb-3">
                                                    <FaLock className="text-stone-600 text-2xl" />
                                                </div>
                                                <div className="bg-white/90 px-4 py-2 rounded-lg">
                                                    <LevelBadge
                                                        level={(video as any).required_level || 1}
                                                        size="sm"
                                                        showName={false}
                                                    />
                                                    <p className="text-xs text-stone-600 mt-1">
                                                        Nivel {(video as any).required_level} requerido
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No videos found */}
                        {availableVideos.length === 0 && lockedVideos.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                                <p className="text-stone-500">No se encontraron vídeos con estos filtros.</p>
                                <button
                                    onClick={() => { setSelectedArea('all'); setSearchTerm(''); }}
                                    className="mt-2 text-asparragus font-medium hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ContenidosPage;
