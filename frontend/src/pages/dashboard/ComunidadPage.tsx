// frontend/src/pages/dashboard/ComunidadPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../lib/api';
import { FiMessageSquare, FiUser, FiClock, FiPlus } from 'react-icons/fi';
import CreatePostModal from '../../components/community/CreatePostModal';

interface Post {
    id: string;
    area: string;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    author_name: string;
    author_id: string;
    comments_count: number;
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

export default function ComunidadPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [selectedArea]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = selectedArea ? { area: selectedArea } : {};
            const response = await api.get('/community/posts', { params });
            setPosts(response.data);
        } catch (error) {
            console.error('[COMMUNITY] Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const PostCard = ({ post }: { post: Post }) => (
        <Link
            to={`/dashboard/comunidad/${post.id}`}
            className="block bg-white rounded-xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 bg-asparragus/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiUser className="w-5 h-5 text-asparragus" />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-asparragus">{post.author_name}</span>
                        <span className="text-stone-400">•</span>
                        <span className="text-sm text-stone-500 flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" />
                            {formatDate(post.created_at)}
                        </span>
                        {post.is_pinned && (
                            <>
                                <span className="text-stone-400">•</span>
                                <span className="text-xs text-gold font-medium">📌 Fijado</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-gotu text-lg text-asparragus mb-2 line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Content preview */}
                    <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                        {post.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="inline-block px-2.5 py-1 bg-asparragus/5 rounded-full text-xs font-medium text-asparragus">
                            {areaNames[post.area] || post.area}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <FiMessageSquare className="w-4 h-4" />
                            <span>{post.comments_count} {post.comments_count === 1 ? 'comentario' : 'comentarios'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <Helmet>
                <title>Comunidad | Dharma en Ruta</title>
            </Helmet>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-gotu text-3xl text-asparragus mb-2">Comunidad</h1>
                    <p className="text-asparragus/70">
                        Conecta, comparte y aprende con otros miembros
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors font-medium"
                >
                    <FiPlus className="w-5 h-5" />
                    Crear Post
                </button>
            </div>

            {/* Filter by area */}
            <div>
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

            {/* Posts list */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparragus"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FiMessageSquare className="w-16 h-16 text-asparragus/20 mx-auto mb-4" />
                    <p className="text-asparragus/60 mb-2">
                        {selectedArea ? 'No hay posts en esta área' : 'Aún no hay posts en la comunidad'}
                    </p>
                    <p className="text-sm text-asparragus/50 mb-4">
                        Sé el primero en compartir algo
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors text-sm"
                    >
                        <FiPlus className="w-4 h-4" />
                        Crear Post
                    </button>
                </div>
            )}

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={() => {
                        setShowCreateModal(false);
                        fetchPosts();
                    }}
                />
            )}
        </div>
    );
}
