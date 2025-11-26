// frontend/src/pages/dashboard/DashboardInicio.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiVideo, FiCalendar, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function DashboardInicio() {
    const { user } = useAuth();

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-3xl font-gotu text-asparragus mb-2">
                    ¡Hola, {user?.nombre}! 👋
                </h1>
                <p className="text-asparragus/70">
                    Bienvenido a tu área de miembros de Dharma en Ruta
                </p>
            </div>

            {/* Membership status card */}
            <div className="bg-gradient-to-br from-asparragus to-asparragus/80 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-gotu mb-2">Estado de membresía</h2>
                        <p className="text-white/90 mb-4">
                            {user?.isMember ? 'Tu membresía está activa' : 'Membresía inactiva'}
                        </p>
                        {!user?.isMember && (
                            <Link
                                to="/registro"
                                className="inline-block bg-white text-asparragus px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                            >
                                Activar membresía
                            </Link>
                        )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isMember ? 'bg-green-500' : 'bg-white/20'
                        }`}>
                        {user?.isMember ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
            </div>

            {/* Quick access grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    to="/dashboard/contenidos"
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 bg-asparragus/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-asparragus/20 transition-colors">
                        <FiVideo className="w-6 h-6 text-asparragus" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Contenidos</h3>
                    <p className="text-sm text-asparragus/60">Explora la biblioteca</p>
                </Link>

                <Link
                    to="/dashboard/reservas"
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                        <FiCalendar className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Mis Reservas</h3>
                    <p className="text-sm text-asparragus/60">Ver sesiones</p>
                </Link>

                <div className="bg-white rounded-xl p-6 opacity-60">
                    <div className="w-12 h-12 bg-raw/10 rounded-lg flex items-center justify-center mb-4">
                        <FiUsers className="w-6 h-6 text-raw" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Comunidad</h3>
                    <p className="text-sm text-asparragus/60">Próximamente</p>
                </div>

                <div className="bg-white rounded-xl p-6 opacity-60">
                    <div className="w-12 h-12 bg-asparragus/10 rounded-lg flex items-center justify-center mb-4">
                        <FiTrendingUp className="w-6 h-6 text-asparragus" />
                    </div>
                    <h3 className="font-gotu text-lg text-asparragus mb-1">Directos</h3>
                    <p className="text-sm text-asparragus/60">Próximamente</p>
                </div>
            </div>

            {/* Placeholder sections */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6">
                    <h3 className="font-gotu text-lg text-asparragus mb-4">Continúa donde lo dejaste</h3>
                    <p className="text-sm text-asparragus/60">
                        Aquí aparecerán los vídeos que estés viendo
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6">
                    <h3 className="font-gotu text-lg text-asparragus mb-4">Próximas sesiones</h3>
                    <p className="text-sm text-asparragus/60">
                        Tus reservas confirmadas aparecerán aquí
                    </p>
                </div>
            </div>
        </div>
    );
}
