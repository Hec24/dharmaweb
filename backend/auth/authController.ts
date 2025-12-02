// backend/auth/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 días

interface RegisterBody {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
}

interface LoginBody {
    email: string;
    password: string;
}

// Registro de nuevo usuario
export async function register(req: Request, res: Response) {
    try {
        const { email, password, nombre, apellidos }: RegisterBody = req.body;

        // Validaciones
        if (!email || !password || !nombre || !apellidos) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el email ya existe
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, nombre, apellidos, is_member, membership_status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, nombre, apellidos, is_member, membership_status, created_at`,
            [email.toLowerCase(), passwordHash, nombre, apellidos, false, 'inactive']
        );

        const user = result.rows[0];

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellidos: user.apellidos,
                isMember: user.is_member,
                membershipStatus: user.membership_status,
            },
        });
    } catch (error: any) {
        console.error('[AUTH] Error en registro:', error);
        return res.status(500).json({ error: 'Error al crear la cuenta' });
    }
}

// Login de usuario
export async function login(req: Request, res: Response) {
    try {
        const { email, password }: LoginBody = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        const result = await pool.query(
            `SELECT id, email, password_hash, nombre, apellidos, is_member, membership_status
       FROM users WHERE email = $1`,
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellidos: user.apellidos,
                isMember: user.is_member,
                membershipStatus: user.membership_status,
            },
        });
    } catch (error: any) {
        console.error('[AUTH] Error en login:', error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

// Obtener usuario actual (verificar token)
export async function me(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const token = authHeader.substring(7); // Quitar "Bearer "

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

        // Buscar usuario
        const result = await pool.query(
            `SELECT id, email, nombre, apellidos, is_member, membership_status, 
              membership_start_date, membership_end_date
       FROM users WHERE id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        return res.json({
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            isMember: user.is_member,
            membershipStatus: user.membership_status,
            membershipStartDate: user.membership_start_date,
            membershipEndDate: user.membership_end_date,
        });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        console.error('[AUTH] Error en me:', error);
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

// Actualizar perfil de usuario
export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).userId; // Del middleware authenticateToken
        const { nombre, apellidos } = req.body;

        // Validaciones
        if (!nombre || !apellidos) {
            return res.status(400).json({ error: 'Nombre y apellidos son requeridos' });
        }

        if (nombre.trim().length < 2 || apellidos.trim().length < 2) {
            return res.status(400).json({ error: 'Nombre y apellidos deben tener al menos 2 caracteres' });
        }

        // Actualizar usuario
        const result = await pool.query(
            `UPDATE users 
             SET nombre = $1, apellidos = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING id, email, nombre, apellidos, is_member, membership_status, 
                       membership_start_date, membership_end_date`,
            [nombre.trim(), apellidos.trim(), userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        return res.json({
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            isMember: user.is_member,
            membershipStatus: user.membership_status,
            membershipStartDate: user.membership_start_date,
            membershipEndDate: user.membership_end_date,
        });
    } catch (error: any) {
        console.error('[AUTH] Error actualizando perfil:', error);
        return res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
}

// Cambiar contraseña
export async function updatePassword(req: Request, res: Response) {
    try {
        const userId = (req as any).userId; // Del middleware authenticateToken
        const { currentPassword, newPassword } = req.body;

        // Validaciones
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Buscar usuario y verificar contraseña actual
        const result = await pool.query(
            'SELECT id, password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        // Verificar contraseña actual
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Hash de la nueva contraseña
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [newPasswordHash, userId]
        );

        return res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error: any) {
        console.error('[AUTH] Error cambiando contraseña:', error);
        return res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
}
