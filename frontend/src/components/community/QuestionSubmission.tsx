import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { FiThumbsUp, FiSend, FiCheckCircle, FiStar } from 'react-icons/fi';

interface Question {
    id: string;
    question: string;
    status: 'pending' | 'answered' | 'featured';
    votes: number;
    author_name: string;
    user_has_voted: boolean;
    created_at: string;
}

interface QuestionSubmissionProps {
    eventId: string;
}

export default function QuestionSubmission({ eventId }: QuestionSubmissionProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [eventId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/live-events/${eventId}/questions`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim() || submitting) return;

        setSubmitting(true);
        try {
            await api.post(`/live-events/${eventId}/questions`, {
                question: newQuestion.trim()
            });
            setNewQuestion('');
            fetchQuestions();
        } catch (error: any) {
            console.error('Error submitting question:', error);
            alert(error.response?.data?.error || 'Error al enviar la pregunta');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (questionId: string) => {
        try {
            await api.post(`/live-events/questions/${questionId}/vote`);
            fetchQuestions();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const QuestionCard = ({ question }: { question: Question }) => {
        const statusIcons = {
            pending: null,
            answered: <FiCheckCircle className="w-4 h-4 text-green-600" />,
            featured: <FiStar className="w-4 h-4 text-gold" />,
        };

        const statusLabels = {
            pending: null,
            answered: 'Respondida',
            featured: 'Destacada',
        };

        return (
            <div className="bg-white rounded-lg p-4 border border-stone-100">
                <div className="flex items-start gap-3">
                    {/* Vote button */}
                    <button
                        onClick={() => handleVote(question.id)}
                        className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors ${question.user_has_voted
                            ? 'bg-asparragus text-white'
                            : 'bg-stone-100 text-asparragus hover:bg-stone-200'
                            }`}
                    >
                        <FiThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{question.votes}</span>
                    </button>

                    {/* Question content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-asparragus mb-2">{question.question}</p>

                        <div className="flex items-center gap-3 text-xs text-asparragus/60">
                            <span>Por {question.author_name}</span>
                            {statusIcons[question.status] && (
                                <div className="flex items-center gap-1">
                                    {statusIcons[question.status]}
                                    <span>{statusLabels[question.status]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Submit form */}
            <div className="bg-white rounded-xl p-6 border border-stone-100">
                <h3 className="font-gotu text-lg text-asparragus mb-4">
                    Envía tu pregunta
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="¿Qué te gustaría preguntar en este directo?"
                            maxLength={500}
                            rows={3}
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/20 resize-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-asparragus/60">
                                {newQuestion.length}/500 caracteres
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!newQuestion.trim() || submitting}
                        className="flex items-center gap-2 px-6 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="w-4 h-4" />
                        {submitting ? 'Enviando...' : 'Enviar pregunta'}
                    </button>
                </form>
            </div>

            {/* Questions list */}
            <div>
                <h3 className="font-gotu text-lg text-asparragus mb-4">
                    Preguntas de la comunidad ({questions.length})
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asparragus"></div>
                    </div>
                ) : questions.length > 0 ? (
                    <div className="space-y-3">
                        {questions.map((question) => (
                            <QuestionCard key={question.id} question={question} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg border border-stone-100">
                        <p className="text-asparragus/60">
                            Sé el primero en hacer una pregunta
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
