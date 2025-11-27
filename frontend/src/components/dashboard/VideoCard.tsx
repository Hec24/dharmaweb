import React from 'react';
import { Video } from '../../data/types';
import { FaPlay, FaCheck } from 'react-icons/fa';

interface VideoCardProps {
    video: Video;
    onClick: (video: Video) => void;
}

const areaColors: Record<string, string> = {
    elsenderodelyo: 'bg-purple-100 text-purple-800',
    finanzasparaunavidalibre: 'bg-green-100 text-green-800',
    dialogosdeldharma: 'bg-blue-100 text-blue-800',
    elartedehabitar: 'bg-orange-100 text-orange-800',
    templodeexpresionyencuentro: 'bg-yellow-100 text-yellow-800',
    elcaminodelbienestar: 'bg-teal-100 text-teal-800',
    relacionesenarmonia: 'bg-pink-100 text-pink-800',
    cuerpoplaceryconexion: 'bg-red-100 text-red-800',
};

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

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    const progress = video.total_seconds && video.total_seconds > 0
        ? (video.watched_seconds || 0) / video.total_seconds * 100
        : 0;

    return (
        <div
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-stone-100"
            onClick={() => onClick(video)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-stone-200 overflow-hidden">
                <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                        <FaPlay className="text-asparragus ml-1" />
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration_minutes} min
                </div>

                {/* Completed Badge */}
                {video.is_completed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm" title="Visto">
                        <FaCheck size={10} />
                    </div>
                )}

                {/* Progress Bar */}
                {progress > 0 && !video.is_completed && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200">
                        <div
                            className="h-full bg-asparragus"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${areaColors[video.area] || 'bg-gray-100 text-gray-600'}`}>
                        {areaNames[video.area] || 'General'}
                    </span>
                </div>

                <h3 className="font-serif text-lg font-medium text-stone-800 leading-tight mb-2 line-clamp-2 group-hover:text-asparragus transition-colors">
                    {video.title}
                </h3>

                <p className="text-sm text-stone-500 line-clamp-2">
                    {video.description}
                </p>
            </div>
        </div>
    );
};
