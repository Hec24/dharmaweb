// frontend/src/data/levelDefinitions.ts
// Level names and definitions for the progression system

export const LEVEL_NAMES: Record<number, string> = {
    1: 'Iniciado',
    2: 'Explorador',
    3: 'Aprendiz',
    4: 'Practicante',
    5: 'Consciente',
    6: 'Integrador',
    7: 'Guía',
    8: 'Maestro',
    9: 'Sabio',
    10: 'Iluminado'
};

export function getLevelName(level: number): string {
    return LEVEL_NAMES[level] || 'Desconocido';
}

export function getLevelDisplay(level: number): string {
    return `Nivel ${level} - ${getLevelName(level)}`;
}

export function getLevelColor(level: number): string {
    // Return color classes based on level tier
    if (level >= 9) return 'text-purple-600';
    if (level >= 7) return 'text-indigo-600';
    if (level >= 5) return 'text-blue-600';
    if (level >= 3) return 'text-green-600';
    return 'text-amber-600';
}
