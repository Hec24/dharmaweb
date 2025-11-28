import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Video } from '../../data/types';
import { VideoCard } from '../../components/dashboard/VideoCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

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
    const { token } = useAuth();
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
        navigate(`/dashboard/contenidos/${video.id}`);
    };

    return (
        <div className="space-y-8">
            <Helmet>
                <title>Biblioteca de Contenidos | Dharma en Ruta</title>
            </Helmet>

            {/* Header & Filters */}
            <div className="bg-white p-6 rounded-t-none rounded-b-2xl shadow-sm border border-stone-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-serif text-2xl text-stone-800">Biblioteca de Contenidos</h1>
                        <p className="text-stone-500 text-sm">Explora recursos para tu crecimiento</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
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

                {/* Area Filters */}
                <div className="flex flex-wrap gap-2">
                    {areas.map((area) => (
                        <button
                            key={area.id}
                            onClick={() => setSelectedArea(area.id)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-all ${selectedArea === area.id
                                ? 'bg-asparragus text-white shadow-md'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            {area.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Video Grid */}
            <div className="px-6 pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-xl h-64 shadow-sm"></div>
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onClick={handleVideoClick}
                            />
                        ))}
                    </div>
                ) : (
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
            </div>
        </div>
    );
};

export default ContenidosPage;
