import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { FiExternalLink, FiFileText, FiVideo, FiLink, FiBook } from 'react-icons/fi';

interface Resource {
    id: string;
    title: string;
    description: string;
    resource_type: 'pdf' | 'link' | 'guide' | 'video' | 'article';
    url: string;
    area: string | null;
    is_featured: boolean;
    created_by_name: string;
    created_at: string;
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

const resourceTypeIcons = {
    pdf: FiFileText,
    link: FiLink,
    guide: FiBook,
    video: FiVideo,
    article: FiFileText,
};

const resourceTypeLabels = {
    pdf: 'PDF',
    link: 'Enlace',
    guide: 'Guía',
    video: 'Video',
    article: 'Artículo',
};

export default function RecursosTab() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState<string>('');

    useEffect(() => {
        fetchResources();
    }, [selectedArea]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = selectedArea ? { area: selectedArea } : {};
            const response = await api.get('/community/resources', { params });
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const ResourceCard = ({ resource }: { resource: Resource }) => {
        const Icon = resourceTypeIcons[resource.resource_type];

        return (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl p-5 border border-stone-100 hover:shadow-md transition-shadow group"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asparragus/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-asparragus/20 transition-colors">
                        <Icon className="w-6 h-6 text-asparragus" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-gotu text-lg text-asparragus group-hover:text-asparragus/80 transition-colors">
                                {resource.title}
                                {resource.is_featured && (
                                    <span className="ml-2 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full font-normal">
                                        Destacado
                                    </span>
                                )}
                            </h3>
                            <FiExternalLink className="w-5 h-5 text-asparragus/40 flex-shrink-0" />
                        </div>

                        {resource.description && (
                            <p className="text-sm text-asparragus/70 mb-3 line-clamp-2">
                                {resource.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-asparragus/60">
                            <span className="px-2 py-1 bg-asparragus/5 rounded">
                                {resourceTypeLabels[resource.resource_type]}
                            </span>
                            {resource.area && (
                                <span>{areaNames[resource.area] || resource.area}</span>
                            )}
                        </div>
                    </div>
                </div>
            </a>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filter */}
            <div className="flex items-center gap-4">
                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-asparragus focus:outline-none focus:ring-2 focus:ring-asparragus/20"
                >
                    <option value="">Todas las áreas</option>
                    {Object.entries(areaNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Resources Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparragus"></div>
                </div>
            ) : resources.length > 0 ? (
                <div className="grid gap-4">
                    {resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FiBook className="w-16 h-16 text-asparragus/20 mx-auto mb-4" />
                    <p className="text-asparragus/60 mb-2">
                        No hay recursos disponibles
                    </p>
                    <p className="text-sm text-asparragus/50">
                        Vuelve pronto para ver nuevos recursos
                    </p>
                </div>
            )}
        </div>
    );
}
