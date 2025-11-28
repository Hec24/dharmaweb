import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { Video } from '../../data/types';
import { FaArrowLeft, FaCheck, FaClock } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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

const VideoPlayerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [markingComplete, setMarkingComplete] = useState(false);

    useEffect(() => {
        if (id) {
            fetchVideo();
        }
    }, [id, token]);

    const fetchVideo = async () => {
        try {
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${BACKEND_URL}/api/contenidos/${id}`, {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                setVideo(data);
            } else {
                console.error('Error fetching video');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        if (!video || !token) {
            console.log('[DEBUG] Cannot mark complete:', { hasVideo: !!video, hasToken: !!token });
            return;
        }

        console.log('[DEBUG] Marking video as complete:', video.id);
        setMarkingComplete(true);
        try {
            const payload = {
                watchedSeconds: video.duration_minutes * 60,
                totalSeconds: video.duration_minutes * 60,
                isCompleted: true
            };
            console.log('[DEBUG] Sending payload:', payload);

            const response = await fetch(`${BACKEND_URL}/api/contenidos/${id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('[DEBUG] Response status:', response.status);
            const data = await response.json();
            console.log('[DEBUG] Response data:', data);

            if (response.ok) {
                setVideo({ ...video, is_completed: true });
                console.log('[DEBUG] Video marked as complete');
            } else {
                console.error('[DEBUG] Failed to mark complete:', data);
            }
        } catch (error) {
            console.error('[DEBUG] Error marking complete:', error);
        } finally {
            setMarkingComplete(false);
        }
    };

    const getEmbedUrl = (video: Video) => {
        if (video.video_provider === 'youtube') {
            return `https://www.youtube.com/embed/${video.video_id}`;
        } else if (video.video_provider === 'vimeo') {
            return `https://player.vimeo.com/video/${video.video_id}`;
        }
        return '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparragus"></div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="p-8 text-center">
                <p className="text-stone-500">Vídeo no encontrado</p>
                <button
                    onClick={() => navigate('/dashboard/contenidos')}
                    className="mt-4 text-asparragus hover:underline"
                >
                    Volver a contenidos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-6">{/* Added pt-6 */}
            <Helmet>
                <title>{video.title} | Dharma en Ruta</title>
            </Helmet>

            {/* Back button */}
            <button
                onClick={() => navigate('/dashboard/contenidos')}
                className="flex items-center gap-2 text-stone-600 hover:text-asparragus transition-colors"
            >
                <FaArrowLeft />
                <span>Volver a contenidos</span>
            </button>

            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="aspect-video bg-black">
                    <iframe
                        src={getEmbedUrl(video)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-asparragus/10 text-asparragus">
                                    {areaNames[video.area] || 'General'}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-stone-500">
                                    <FaClock size={12} />
                                    {video.duration_minutes} min
                                </span>
                            </div>
                            <h1 className="font-serif text-2xl text-stone-800 mb-2">
                                {video.title}
                            </h1>
                            <p className="text-stone-600 leading-relaxed">
                                {video.description}
                            </p>
                        </div>

                        {/* Mark Complete Button */}
                        {!video.is_completed && (
                            <button
                                onClick={handleMarkComplete}
                                disabled={markingComplete}
                                className="flex items-center gap-2 px-4 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                <FaCheck />
                                {markingComplete ? 'Guardando...' : 'Marcar como visto'}
                            </button>
                        )}

                        {video.is_completed && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                                <FaCheck />
                                <span>Completado</span>
                            </div>
                        )}
                    </div>

                    {/* Progress indicator */}
                    {video.watched_seconds && video.total_seconds && !video.is_completed && (
                        <div className="pt-4 border-t border-stone-100">
                            <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
                                <span>Progreso</span>
                                <span>{Math.round((video.watched_seconds / video.total_seconds) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-asparragus transition-all"
                                    style={{ width: `${(video.watched_seconds / video.total_seconds) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related videos placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h2 className="font-serif text-xl text-stone-800 mb-4">
                    Más vídeos de {areaNames[video.area]}
                </h2>
                <p className="text-stone-500 text-sm">
                    Próximamente: recomendaciones personalizadas
                </p>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
