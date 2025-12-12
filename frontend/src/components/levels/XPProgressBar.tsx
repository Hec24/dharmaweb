// frontend/src/components/levels/XPProgressBar.tsx
import React from 'react';

interface XPProgressBarProps {
    currentXp: number;
    level: number;
    showDetails?: boolean;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 6000, 10000];

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
    currentXp,
    level,
    showDetails = true
}) => {
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold;

    const xpInLevel = currentXp - currentThreshold;
    const xpNeeded = nextThreshold - currentThreshold;
    const percentage = Math.min((xpInLevel / xpNeeded) * 100, 100);

    const isMaxLevel = level >= 10;

    return (
        <div className="w-full">
            {showDetails && (
                <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
                    <span className="font-medium">Progreso XP</span>
                    {!isMaxLevel ? (
                        <span className="text-xs">
                            {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-600">
                            ¡Nivel Máximo!
                        </span>
                    )}
                </div>
            )}

            <div className="h-3 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-asparragus to-green-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {showDetails && !isMaxLevel && (
                <div className="text-xs text-stone-500 mt-1 text-right">
                    {Math.round(percentage)}% hasta Nivel {level + 1}
                </div>
            )}
        </div>
    );
};

export default XPProgressBar;
