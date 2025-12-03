// frontend/src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiHome, FiVideo, FiCalendar, FiUser, FiLogOut, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface NavItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { name: 'Inicio', path: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Biblioteca', path: '/dashboard/contenidos', icon: <FiVideo className="w-5 h-5" /> },
    { name: 'Directos', path: '/dashboard/directos', icon: <FiTrendingUp className="w-5 h-5" /> },
    { name: 'Comunidad', path: '/dashboard/comunidad', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Mis Reservas', path: '/dashboard/reservas', icon: <FiCalendar className="w-5 h-5" /> },
    { name: 'Mi Perfil', path: '/dashboard/perfil', icon: <FiUser className="w-5 h-5" /> },
];

export function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-linen">
            {/* Mobile header */}
            <div className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-linen transition-colors"
                    >
                        {sidebarOpen ? <FiX className="w-6 h-6 text-asparragus" /> : <FiMenu className="w-6 h-6 text-asparragus" />}
                    </button>
                    <h1 className="font-gotu text-xl text-asparragus">Dashboard</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-linen">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/img/Logos/Logos-08.png" alt="Dharma en Ruta" className="h-10" />
                        </Link>
                    </div>

                    {/* User info */}
                    <div className="p-6 border-b border-linen">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-asparragus/10 flex items-center justify-center">
                                <span className="text-asparragus font-semibold">
                                    {user?.nombre.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-asparragus truncate">
                                    {user?.nombre} {user?.apellidos}
                                </p>
                                <p className="text-xs text-asparragus/60 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                                        ? 'bg-asparragus text-white'
                                        : 'text-asparragus hover:bg-linen'
                                    }
                `}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout button */}
                    <div className="p-4 border-t border-linen">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-asparragus hover:bg-linen rounded-lg transition-colors"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span className="font-medium">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                <main className="min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
