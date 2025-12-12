import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const { token, user, refreshUserData } = useAuth();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
    const playerRef = useRef<any>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [currentProgress, setCurrentProgress] = useState<{ watched: number; total: number } | null>(null);
    const [xpNotification, setXpNotification] = useState<{ xp: number; leveledUp: boolean; newLevel?: number } | null>(null);
    const [isAutoCompleting, setIsAutoCompleting] = useState(false);

    // Get referrer from location state, default to biblioteca
    const referrer = (location.state as any)?.from || '/dashboard/contenidos';
    const referrerName = referrer === '/dashboard/tu-camino' ? 'Tu Camino' : 'biblioteca';

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

            // Check for auto-completion at 98% to account for timing variations
            const progressPercent = (currentTime / duration) * 100;
            if (progressPercent >= 98 && !video.is_completed && !isAutoCompleting) {
                console.log('[VIDEO] Auto-completing at', progressPercent.toFixed(1), '%');
                setIsAutoCompleting(true);
                await handleMarkComplete();
                return;
            }

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

            // Update local progress state (without triggering player reinitialization)
            setCurrentProgress({
                watched: Math.floor(currentTime),
                total: Math.floor(duration)
            });

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

            const response = await fetch(`${BACKEND_URL}/api/contenidos/${id}/progress`, {
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

            if (response.ok) {
                const result = await response.json();

                // Update video state
                setVideo({ ...video, is_completed: true });

                // Show XP notification if XP was awarded
                if (result.xpAwarded && result.xpAwarded > 0) {
                    setXpNotification({
                        xp: result.xpAwarded,
                        leveledUp: result.leveledUp || false,
                        newLevel: result.newLevel
                    });

                    // Hide notification after 5 seconds
                    setTimeout(() => setXpNotification(null), 5000);
                }

                // Refresh user data to update XP/level in UI
                await refreshUserData();

                console.log('[VIDEO] Marked as complete, XP awarded:', result.xpAwarded);
            }
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
                onClick={() => navigate(referrer)}
                className="flex items-center gap-2 text-stone-600 hover:text-asparragus transition-colors"
            >
                <FaArrowLeft />
                <span>Volver a {referrerName}</span>
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
                    {(currentProgress || (video.watched_seconds && video.total_seconds)) && !video.is_completed && (
                        <div className="pt-4 border-t border-stone-100">
                            <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
                                <span>Progreso</span>
                                <span>
                                    {Math.round(
                                        ((currentProgress?.watched || video.watched_seconds || 0) /
                                            (currentProgress?.total || video.total_seconds || 1)) * 100
                                    )}%
                                </span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-asparragus transition-all"
                                    style={{
                                        width: `${(
                                            (currentProgress?.watched || video.watched_seconds || 0) /
                                            (currentProgress?.total || video.total_seconds || 1)
                                        ) * 100}%`
                                    }}
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

            {/* XP Notification */}
            {xpNotification && (
                <div className="fixed bottom-8 right-8 bg-gradient-to-r from-asparragus to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce z-50">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">🎉</div>
                        <div>
                            <div className="font-bold text-lg">+{xpNotification.xp} XP</div>
                            {xpNotification.leveledUp && (
                                <div className="text-sm">¡Subiste al nivel {xpNotification.newLevel}!</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayerPage;
