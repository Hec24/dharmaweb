// frontend/src/components/community/CreatePostModal.tsx
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { api } from '../../lib/api';

interface CreatePostModalProps {
    onClose: () => void;
    onSuccess: () => void;
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

export default function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
    const [formData, setFormData] = useState({
        area: '',
        title: '',
        content: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.area || !formData.title.trim() || !formData.content.trim()) {
            setError('Todos los campos son requeridos');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/community/posts', formData);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('[COMMUNITY] Error creating post:', error);
            setError(error.response?.data?.error || 'Error al crear el post');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-gotu text-2xl text-asparragus">Crear Nuevo Post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Area selector */}
                    <div>
                        <label className="block text-sm font-medium text-asparragus mb-2">
                            Área de conocimiento *
                        </label>
                        <select
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20"
                            required
                        >
                            <option value="">Selecciona un área</option>
                            {Object.entries(areaNames).map(([key, name]) => (
                                <option key={key} value={key}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-asparragus mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="¿De qué quieres hablar?"
                            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20"
                            maxLength={255}
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-asparragus mb-2">
                            Contenido *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Comparte tus pensamientos, preguntas o experiencias..."
                            rows={8}
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 resize-none"
                            required
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
