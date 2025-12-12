// frontend/src/pages/dashboard/TuCaminoPage.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Video } from '../../data/types';
import { VideoCard } from '../../components/dashboard/VideoCard';
import LevelBadge from '../../components/levels/LevelBadge';
import XPProgressBar from '../../components/levels/XPProgressBar';
import { FaTrophy, FaStar, FaFire } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const TuCaminoPage: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendedContent();
    }, [token]);

    const fetchRecommendedContent = async () => {
        setLoading(true);
        try {
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${BACKEND_URL}/api/contenidos`, {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                // Filter videos for current level
                const userLevel = user?.current_level || 1;
                const levelVideos = data.videos.filter((v: any) =>
                    (v.required_level || 1) === userLevel && !v.is_completed
                );
                setRecommendedVideos(levelVideos.slice(0, 6));
            }
        } catch (error) {
            console.error('Error fetching recommended content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (video: Video) => {
        navigate(`/dashboard/contenidos/${video.id}`);
    };

    if (!user) return null;

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Helmet>
                <title>Tu Camino | Dharma en Ruta</title>
            </Helmet>

            {/* Header with Level Info */}
            <div className="mb-8">
                <h1 className="text-3xl font-gotu text-asparragus mb-4">Tu Camino Personal</h1>
                <p className="text-stone-600 mb-6">
                    Contenido personalizado según tu nivel de progreso
                </p>

                {/* Level Progress Card */}
                <div className="bg-gradient-to-br from-asparragus/10 to-green-50 rounded-2xl p-6 border border-asparragus/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <LevelBadge level={user.current_level || 1} size="lg" />
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">
                                    ¡Sigue avanzando!
                                </h2>
                                <p className="text-sm text-stone-600">
                                    {user.daily_xp || 0} XP ganados hoy
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-asparragus">
                                {user.total_xp?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-stone-600">XP Total</div>
                        </div>
                    </div>

                    <XPProgressBar
                        currentXp={user.total_xp || 0}
                        level={user.current_level || 1}
                    />
                </div>
            </div>

            {/* Recommended Content for Current Level */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <FaStar className="text-amber-500" />
                    <h2 className="text-2xl font-gotu text-stone-800">
                        Recomendado para Nivel {user.current_level}
                    </h2>
                </div>
                <p className="text-stone-600 mb-6">
                    Contenido seleccionado específicamente para tu nivel actual
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white rounded-xl h-64 shadow-sm"></div>
                        ))}
                    </div>
                ) : recommendedVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onClick={handleVideoClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                        <FaTrophy className="text-5xl text-amber-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-stone-800 mb-2">
                            ¡Excelente trabajo!
                        </h3>
                        <p className="text-stone-600">
                            Has completado todo el contenido de tu nivel actual.
                            Sigue ganando XP para desbloquear el siguiente nivel.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-asparragus/10 rounded-lg flex items-center justify-center">
                            <FaFire className="text-asparragus" />
                        </div>
                        <h3 className="font-semibold text-stone-800">Racha Diaria</h3>
                    </div>
                    <div className="text-3xl font-bold text-asparragus mb-1">
                        {user.daily_xp || 0}
                    </div>
                    <p className="text-sm text-stone-600">XP hoy (máx. 200)</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FaTrophy className="text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-stone-800">Nivel Actual</h3>
                    </div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">
                        {user.current_level}
                    </div>
                    <p className="text-sm text-stone-600">de 10 niveles</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaStar className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-stone-800">XP Total</h3>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                        {user.total_xp?.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-stone-600">Experiencia acumulada</p>
                </div>
            </div>
        </div>
    );
};

export default TuCaminoPage;
