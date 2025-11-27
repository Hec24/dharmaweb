// backend/auth/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

// Middleware para verificar token JWT
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    console.log('[AUTH] Authenticating request:', {
        hasAuthHeader: !!authHeader,
        authHeader: authHeader?.substring(0, 20) + '...'
    });

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[AUTH] No valid auth header');
        return res.status(401).json({ error: 'No autorizado - Token requerido' });
    }

    const token = authHeader.substring(7); // Quitar "Bearer "

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        console.log('[AUTH] Token verified, userId:', decoded.userId);
        next();
    } catch (error: any) {
        console.log('[AUTH] Token verification failed:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
}

// Middleware opcional - no falla si no hay token
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
    } catch (error) {
        // Ignorar errores en auth opcional
    }

    next();
}
