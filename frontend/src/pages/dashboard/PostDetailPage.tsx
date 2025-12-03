// frontend/src/pages/dashboard/PostDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiClock, FiArrowLeft, FiTrash2, FiFlag, FiSend } from 'react-icons/fi';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    author_name: string;
    author_id: string;
}

interface Post {
    id: string;
    area: string;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    author_name: string;
    author_id: string;
    comments: Comment[];
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

export default function PostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/community/posts/${postId}`);
            setPost(response.data);
        } catch (error) {
            console.error('[COMMUNITY] Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const response = await api.post(`/community/posts/${postId}/comments`, {
                content: newComment.trim()
            });

            // Add new comment to the list
            if (post) {
                setPost({
                    ...post,
                    comments: [...post.comments, response.data]
                });
            }
            setNewComment('');
        } catch (error) {
            console.error('[COMMUNITY] Error creating comment:', error);
            alert('Error al crear el comentario');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

        try {
            await api.delete(`/community/posts/${postId}`);
            navigate('/dashboard/comunidad');
        } catch (error) {
            console.error('[COMMUNITY] Error deleting post:', error);
            alert('Error al eliminar el post');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

        try {
            await api.delete(`/community/comments/${commentId}`);

            // Remove comment from the list
            if (post) {
                setPost({
                    ...post,
                    comments: post.comments.filter(c => c.id !== commentId)
                });
            }
        } catch (error) {
            console.error('[COMMUNITY] Error deleting comment:', error);
            alert('Error al eliminar el comentario');
        }
    };

    const handleReportContent = async (itemType: 'post' | 'comment', itemId: string) => {
        const reason = prompt('¿Por qué reportas este contenido?');
        if (!reason) return;

        try {
            await api.post('/community/report', {
                itemType,
                itemId,
                reason
            });
            alert('Reporte enviado correctamente. Gracias por ayudarnos a mantener la comunidad segura.');
        } catch (error) {
            console.error('[COMMUNITY] Error reporting content:', error);
            alert('Error al enviar el reporte');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparragus"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-6 lg:p-8">
                <div className="text-center py-12">
                    <p className="text-asparragus/60 mb-4">Post no encontrado</p>
                    <Link
                        to="/dashboard/comunidad"
                        className="inline-flex items-center gap-2 text-asparragus hover:text-asparragus/80"
                    >
                        <FiArrowLeft />
                        Volver a la comunidad
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthor = user?.id === post.author_id;

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
            <Helmet>
                <title>{post.title} | Comunidad | Dharma en Ruta</title>
            </Helmet>

            {/* Back button */}
            <Link
                to="/dashboard/comunidad"
                className="inline-flex items-center gap-2 text-asparragus hover:text-asparragus/80 transition-colors"
            >
                <FiArrowLeft />
                Volver a la comunidad
            </Link>

            {/* Post */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                {/* Area badge */}
                <span className="inline-block px-3 py-1 bg-asparragus/10 rounded-full text-sm font-medium text-asparragus mb-4">
                    {areaNames[post.area] || post.area}
                </span>

                {/* Title */}
                <h1 className="font-gotu text-3xl text-asparragus mb-4">{post.title}</h1>

                {/* Author and date */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
                    <div className="w-10 h-10 bg-asparragus/10 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-asparragus" />
                    </div>
                    <div>
                        <p className="font-medium text-asparragus">{post.author_name}</p>
                        <p className="text-sm text-stone-500 flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" />
                            {formatDate(post.created_at)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="ml-auto flex items-center gap-2">
                        {isAuthor && (
                            <button
                                onClick={handleDeletePost}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar post"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        )}
                        {!isAuthor && (
                            <button
                                onClick={() => handleReportContent('post', post.id)}
                                className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Reportar contenido"
                            >
                                <FiFlag className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-stone max-w-none">
                    <p className="text-stone-700 whitespace-pre-wrap">{post.content}</p>
                </div>
            </div>

            {/* Comments section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <h2 className="font-gotu text-xl text-asparragus mb-6">
                    Comentarios ({post.comments.length})
                </h2>

                {/* Comment form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows={3}
                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="flex items-center gap-2 px-4 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiSend className="w-4 h-4" />
                            {submitting ? 'Enviando...' : 'Comentar'}
                        </button>
                    </div>
                </form>

                {/* Comments list */}
                <div className="space-y-4">
                    {post.comments.length === 0 ? (
                        <p className="text-center text-stone-500 py-8">
                            Aún no hay comentarios. Sé el primero en comentar.
                        </p>
                    ) : (
                        post.comments.map(comment => {
                            const isCommentAuthor = user?.id === comment.author_id;
                            return (
                                <div key={comment.id} className="border-l-2 border-stone-200 pl-4 py-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-asparragus/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiUser className="w-4 h-4 text-asparragus" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm text-asparragus">
                                                    {comment.author_name}
                                                </span>
                                                <span className="text-xs text-stone-500">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-stone-700 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {isCommentAuthor && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Eliminar comentario"
                                                >
                                                    <FiTrash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {!isCommentAuthor && (
                                                <button
                                                    onClick={() => handleReportContent('comment', comment.id)}
                                                    className="p-1.5 text-stone-500 hover:bg-stone-100 rounded transition-colors"
                                                    title="Reportar comentario"
                                                >
                                                    <FiFlag className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
