import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { Video } from '../../data/types';
import { FaArrowLeft, FaCheck, FaClock } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// YouTube Player API types
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
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

const VideoPlayerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
    const playerRef = useRef<any>(null);
    const [playerReady, setPlayerReady] = useState(false);

    // Load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }, []);

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

    // Initialize YouTube player when video data is loaded
    useEffect(() => {
        if (!video || video.video_provider !== 'youtube') return;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) {
                setTimeout(initPlayer, 100);
                return;
            }

            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: video.video_id,
                playerVars: {
                    start: video.watched_seconds && !video.is_completed && video.watched_seconds > 10
                        ? Math.floor(video.watched_seconds)
                        : 0,
                    autoplay: 0,
                    rel: 0,
                },
                events: {
                    onReady: () => {
                        console.log('[VIDEO] Player ready');
                        setPlayerReady(true);
                    },
                },
            });
        };

        initPlayer();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [video]);

    // Start tracking when player is ready
    useEffect(() => {
        if (!playerReady || !video || !token) return;

        console.log('[VIDEO] Setting up progress tracking');

        // Save progress every 15 seconds
        const interval = setInterval(() => {
            saveProgressFromPlayer();
        }, 15000);

        setProgressInterval(interval);

        return () => {
            if (interval) {
                clearInterval(interval);
                console.log('[VIDEO] Cleaning up progress tracking');
            }
        };
    }, [playerReady, video, token]);

    const saveProgressFromPlayer = async () => {
        if (!video || !token || !playerRef.current) return;

        try {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();

            if (!currentTime || !duration) return;

            console.log('[VIDEO] Saving progress:', Math.floor(currentTime), '/', Math.floor(duration));

            await fetch(`${BACKEND_URL}/api/contenidos/${id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    watchedSeconds: Math.floor(currentTime),
                    totalSeconds: Math.floor(duration),
                    isCompleted: false
                })
            });

            // Update local state to reflect progress
            setVideo(prev => prev ? {
                ...prev,
                watched_seconds: Math.floor(currentTime),
                total_seconds: Math.floor(duration)
            } : null);

            console.log('[VIDEO] Progress saved');
        } catch (error) {
            console.error('[VIDEO] Error saving progress:', error);
        }
    };

    const handleMarkComplete = async () => {
        if (!video || !token) return;

        try {
            console.log('[VIDEO] Marking as complete');

            const duration = playerRef.current?.getDuration() || video.duration_minutes * 60;

            await fetch(`${BACKEND_URL}/api/contenidos/${id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    watchedSeconds: Math.floor(duration),
                    totalSeconds: Math.floor(duration),
                    isCompleted: true
                })
            });

            setVideo({ ...video, is_completed: true });
            console.log('[VIDEO] Marked as complete');
        } catch (error) {
            console.error('[VIDEO] Error marking complete:', error);
        }
    };

    const getVimeoEmbedUrl = (video: Video) => {
        let url = `https://player.vimeo.com/video/${video.video_id}`;

        // Vimeo uses #t= for time
        if (video.watched_seconds && !video.is_completed && video.watched_seconds > 10) {
            url += `#t=${Math.floor(video.watched_seconds)}s`;
        }

        return url;
    };

    // Si el usuario no tiene membresía activa, mostrar estado bloqueado
    if (user?.membershipStatus !== 'active') {
        return (
            <div className="space-y-8 pt-6">
                <Helmet>
                    <title>Contenido Exclusivo | Dharma en Ruta</title>
                </Helmet>

                <div className="px-6 pb-8">
                    <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="font-serif text-2xl text-stone-800 mb-4">Contenido Exclusivo para Miembros</h2>
                        <p className="text-stone-600 mb-8 leading-relaxed">
                            Este vídeo está reservado para miembros activos de la comunidad Dharma en Ruta.
                            Activa tu membresía para acceder a este y otros contenidos exclusivos.
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
                    Volver a biblioteca
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-6">
            <Helmet>
                <title>{video.title} | Dharma en Ruta</title>
            </Helmet>

            {/* Back button */}
            <button
                onClick={() => navigate('/dashboard/contenidos')}
                className="flex items-center gap-2 text-stone-600 hover:text-asparragus transition-colors"
            >
                <FaArrowLeft />
                <span>Volver a biblioteca</span>
            </button>

            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="aspect-video bg-black">
                    {video.video_provider === 'youtube' ? (
                        <div id="youtube-player" className="w-full h-full"></div>
                    ) : (
                        <iframe
                            src={getVimeoEmbedUrl(video)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
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
                                className="flex items-center gap-2 px-4 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors whitespace-nowrap"
                            >
                                <FaCheck />
                                Marcar como visto
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
