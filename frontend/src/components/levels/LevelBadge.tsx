// frontend/src/components/levels/LevelBadge.tsx
import React from 'react';

interface LevelBadgeProps {
    level: number;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
}

const LEVEL_NAMES: Record<number, string> = {
    1: 'Iniciado',
    2: 'Explorador',
    3: 'Aprendiz',
    4: 'Practicante',
    5: 'Conocedor',
    6: 'Sabio',
    7: 'Maestro',
    8: 'Guía',
    9: 'Iluminado',
    10: 'Dharma'
};

const LEVEL_COLORS: Record<number, string> = {
    1: 'from-stone-400 to-stone-500',
    2: 'from-green-400 to-green-500',
    3: 'from-blue-400 to-blue-500',
    4: 'from-purple-400 to-purple-500',
    5: 'from-pink-400 to-pink-500',
    6: 'from-yellow-400 to-yellow-500',
    7: 'from-orange-400 to-orange-500',
    8: 'from-red-400 to-red-500',
    9: 'from-indigo-400 to-indigo-500',
    10: 'from-amber-400 via-yellow-500 to-amber-600'
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({
    level,
    size = 'md',
    showName = true
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={`
                    ${sizeClasses[size]} 
                    rounded-full 
                    bg-gradient-to-br ${LEVEL_COLORS[level] || LEVEL_COLORS[1]}
                    flex items-center justify-center
                    font-bold text-white
                    shadow-lg
                    ring-2 ring-white
                `}
            >
                {level}
            </div>
            {showName && (
                <div className="flex flex-col">
                    <span className={`font-semibold text-stone-800 ${textSizeClasses[size]}`}>
                        Nivel {level}
                    </span>
                    <span className="text-xs text-stone-500">
                        {LEVEL_NAMES[level]}
                    </span>
                </div>
            )}
        </div>
    );
};

export default LevelBadge;
