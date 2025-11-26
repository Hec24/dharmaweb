// frontend/src/pages/DashboardHome.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-linen">
            {/* Simple header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-gotu text-asparragus">Dashboard</h1>
                    <button
                        onClick={logout}
                        className="text-sm text-asparragus hover:text-asparragus/80"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-gotu text-asparragus mb-2">
                        ¡Hola, {user?.nombre}! 👋
                    </h2>
                    <p className="text-asparragus/80">
                        Bienvenido a tu área de miembros de Dharma en Ruta
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-gotu text-lg text-asparragus mb-4">
                            Estado de membresía
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Email:</span> {user?.email}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Estado:</span>{' '}
                                <span className={user?.isMember ? 'text-green-600' : 'text-gray-600'}>
                                    {user?.isMember ? 'Activo' : 'Inactivo'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-gotu text-lg text-asparragus mb-4">
                            Próximamente
                        </h3>
                        <ul className="space-y-2 text-sm text-asparragus/80">
                            <li>📚 Biblioteca de contenidos</li>
                            <li>📅 Mis reservas</li>
                            <li>💬 Comunidad</li>
                            <li>🎥 Directos</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-asparragus hover:underline"
                    >
                        ← Volver a la página principal
                    </Link>
                </div>
            </main>
        </div>
    );
}
