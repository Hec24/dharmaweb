// frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    nombre: string;
    apellidos: string;
    isMember: boolean;
    membershipStatus: string;
    membershipStartDate?: string;
    membershipEndDate?: string;
    current_level?: number;
    total_xp?: number;
    daily_xp?: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, nombre: string, apellidos: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const TOKEN_KEY = 'dharma_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar token y usuario al iniciar
    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem(TOKEN_KEY);

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setToken(savedToken);
                } else {
                    // Token inválido o expirado
                    localStorage.removeItem(TOKEN_KEY);
                }
            } catch (error) {
                console.error('[AUTH] Error loading user:', error);
                localStorage.removeItem(TOKEN_KEY);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorMessage = 'Error al iniciar sesión';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    console.error('[AUTH] Login error parsing failed:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem(TOKEN_KEY, data.token);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, password: string, nombre: string, apellidos: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, nombre, apellidos }),
            });

            if (!response.ok) {
                let errorMessage = 'Error al crear la cuenta';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    console.error('[AUTH] Register error parsing failed:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem(TOKEN_KEY, data.token);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
