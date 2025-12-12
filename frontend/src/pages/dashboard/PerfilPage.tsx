// frontend/src/pages/dashboard/PerfilPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { FiUser, FiLock, FiCheck, FiAlertCircle, FiCreditCard, FiExternalLink } from 'react-icons/fi';
import LevelBadge from '../../components/levels/LevelBadge';
import XPProgressBar from '../../components/levels/XPProgressBar';

export default function PerfilPage() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Profile form state
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [apellidos, setApellidos] = useState(user?.apellidos || '');

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await api.put('/auth/profile', {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
            });

            updateUser(response.data);
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Error al actualizar el perfil';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        // Validaciones
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
            setPasswordLoading(false);
            return;
        }

        try {
            await api.put('/auth/password', {
                currentPassword,
                newPassword,
            });

            setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Error al cambiar la contraseña';
            setPasswordMessage({ type: 'error', text: errorMsg });
        } finally {
            setPasswordLoading(false);
        }
    };

    // Payment portal state
    const [portalLoading, setPortalLoading] = useState(false);

    const handleOpenPaymentPortal = async () => {
        setPortalLoading(true);
        try {
            const response = await api.post('/stripe/create-portal-session');
            // Redirect to Stripe Customer Portal
            window.location.href = response.data.url;
        } catch (error: any) {
            console.error('Error opening payment portal:', error);
            alert('Error al abrir el portal de pagos. Por favor, inténtalo de nuevo.');
            setPortalLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-gotu text-asparragus mb-2">Mi Perfil</h1>
                <p className="text-asparragus/70">
                    Gestiona tu información personal y configuración de cuenta
                </p>
            </div>

            {/* Level & XP Section */}
            {user?.current_level && (
                <div className="bg-gradient-to-br from-asparragus/5 to-green-50 rounded-xl p-6 shadow-sm border border-asparragus/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-gotu text-asparragus">Tu Progreso</h2>
                        <span className="text-sm text-stone-600">
                            {user.daily_xp || 0} XP ganados hoy
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                        <LevelBadge level={user.current_level} size="lg" />
                        <div className="flex-1">
                            <XPProgressBar
                                currentXp={user.total_xp || 0}
                                level={user.current_level}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-asparragus">
                                {user.total_xp?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-stone-600">XP Total</div>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-asparragus">
                                {user.current_level}
                            </div>
                            <div className="text-xs text-stone-600">Nivel Actual</div>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-asparragus">
                                {user.daily_xp || 0}
                            </div>
                            <div className="text-xs text-stone-600">XP Hoy</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-asparragus/10 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-asparragus" />
                        </div>
                        <h2 className="text-xl font-gotu text-asparragus">Información Personal</h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-asparragus mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-4 py-2 border border-asparragus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="apellidos" className="block text-sm font-medium text-asparragus mb-2">
                                    Apellidos
                                </label>
                                <input
                                    type="text"
                                    id="apellidos"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value)}
                                    className="w-full px-4 py-2 border border-asparragus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-asparragus mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-asparragus/20 rounded-lg bg-gray-50 text-asparragus/60 cursor-not-allowed"
                            />
                            <p className="text-xs text-asparragus/60 mt-1">
                                El email no se puede modificar
                            </p>
                        </div>

                        {message && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                                }`}>
                                {message.type === 'success' ? (
                                    <FiCheck className="w-5 h-5" />
                                ) : (
                                    <FiAlertCircle className="w-5 h-5" />
                                )}
                                <span className="text-sm">{message.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-6 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                            <FiLock className="w-5 h-5 text-gold" />
                        </div>
                        <h2 className="text-xl font-gotu text-asparragus">Cambiar Contraseña</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-asparragus mb-2">
                                Contraseña Actual
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-asparragus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-asparragus mb-2">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-asparragus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-asparragus/60 mt-1">
                                Mínimo 6 caracteres
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-asparragus mb-2">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-asparragus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50"
                                required
                            />
                        </div>

                        {passwordMessage && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${passwordMessage.type === 'success'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                                }`}>
                                {passwordMessage.type === 'success' ? (
                                    <FiCheck className="w-5 h-5" />
                                ) : (
                                    <FiAlertCircle className="w-5 h-5" />
                                )}
                                <span className="text-sm">{passwordMessage.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full md:w-auto px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {passwordLoading ? 'Actualizando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </div>

                {/* Payment Method Management */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FiCreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-gotu text-asparragus">Método de Pago</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-asparragus/70">
                            Gestiona tus métodos de pago, visualiza tu historial de pagos y actualiza tu información de facturación.
                        </p>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-start gap-3">
                                <FiCreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-asparragus mb-1">Portal de Pagos Seguro</h3>
                                    <p className="text-sm text-asparragus/70 mb-3">
                                        Serás redirigido al portal seguro de Stripe donde podrás:
                                    </p>
                                    <ul className="text-sm text-asparragus/70 space-y-1 mb-4">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                            Actualizar tu tarjeta de crédito/débito
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                            Ver historial de pagos y facturas
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                            Descargar recibos
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                            Actualizar información de facturación
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenPaymentPortal}
                            disabled={portalLoading}
                            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                        >
                            {portalLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Abriendo portal...</span>
                                </>
                            ) : (
                                <>
                                    <FiCreditCard className="w-4 h-4" />
                                    <span>Gestionar método de pago</span>
                                    <FiExternalLink className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-asparragus/60">
                            🔒 Tus datos de pago están protegidos por Stripe, líder mundial en procesamiento de pagos seguros.
                        </p>
                    </div>
                </div>

                {/* Membership Status */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-gotu text-asparragus mb-4">Estado de Membresía</h2>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-asparragus/10 to-asparragus/5 rounded-lg">
                        <div>
                            <p className="text-sm text-asparragus/70 mb-1">Estado actual</p>
                            <p className="text-lg font-medium text-asparragus">
                                {user?.membershipStatus === 'active'
                                    ? 'Membresía Activa'
                                    : user?.membershipStatus === 'mvp_only'
                                        ? 'Acceso Anticipado (MVP)'
                                        : 'Membresía Inactiva'}
                            </p>
                            {user?.membershipStatus === 'mvp_only' && (
                                <p className="text-sm text-asparragus/60 mt-2">
                                    Tu membresía completa se activará automáticamente el 21 de marzo de 2026.
                                    <br />
                                    <span className="font-medium text-asparragus/80">Método de pago:</span> Tarjeta guardada para futuro cargo.
                                </p>
                            )}
                            {user?.membershipStartDate && (
                                <p className="text-sm text-asparragus/60 mt-2">
                                    Inicio: {new Date(user.membershipStartDate).toLocaleDateString('es-ES')}
                                </p>
                            )}
                            {user?.membershipEndDate && (
                                <p className="text-sm text-asparragus/60">
                                    Fin: {new Date(user.membershipEndDate).toLocaleDateString('es-ES')}
                                </p>
                            )}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${user?.membershipStatus === 'active'
                            ? 'bg-green-500 text-white'
                            : user?.membershipStatus === 'mvp_only'
                                ? 'bg-gold text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                            {user?.membershipStatus === 'active'
                                ? 'Activo'
                                : user?.membershipStatus === 'mvp_only'
                                    ? 'MVP / Anticipado'
                                    : 'Inactivo'}
                        </div>
                    </div>

                    {user?.membershipStatus !== 'active' && user?.membershipStatus !== 'mvp_only' && (
                        <div className="mt-4">
                            <p className="text-sm text-asparragus/70 mb-3">
                                Activa tu membresía para acceder a todo el contenido exclusivo
                            </p>
                            <a
                                href="/registro"
                                className="inline-block px-6 py-2 bg-asparragus text-white rounded-lg hover:bg-asparragus/90 transition-colors"
                            >
                                Activar membresía
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
