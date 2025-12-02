# Dashboard Enhancements - Deployment Checklist

## Cambios Implementados

### ✅ 1. Mi Perfil Page
- Editar nombre y apellidos
- Cambiar contraseña
- Ver estado de membresía
- **Gestionar método de pago** (requiere configuración Stripe)

### ✅ 2. Continúa donde lo dejaste
- Muestra último vídeo visto con progreso
- Barra de progreso visual
- Click para continuar viendo

### ✅ 3. Próximas sesiones
- Muestra próxima reserva confirmada
- Fecha, hora y acompañante
- Link a todas las reservas

### ✅ 4. Stripe Customer Portal
- Gestión de métodos de pago
- Historial de pagos
- Descargar facturas

---

## Pre-Deploy Checklist

### Backend (Render)
- [ ] Verificar que todas las variables de entorno estén configuradas
- [ ] `STRIPE_SECRET_KEY` (puede ser test por ahora)
- [ ] `FRONTEND_URL` debe apuntar a producción
- [ ] Después del deploy: Ejecutar migración de DB

### Frontend (Vercel)
- [ ] Verificar `VITE_BACKEND_URL` apunta a Render
- [ ] Build debe completarse sin errores

---

## Pasos para Deploy

### 1. Commit y Push

```bash
# Ver cambios
git status

# Añadir todos los archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Dashboard enhancements - Profile, last video, upcoming sessions, Stripe portal"

# Push a GitHub
git push origin main
```

### 2. Verificar Deploys Automáticos

- **Vercel**: Frontend se desplegará automáticamente
- **Render**: Backend se desplegará automáticamente

### 3. Ejecutar Migración de DB (IMPORTANTE)

Una vez que Render termine el deploy:

```bash
# Conectar a la base de datos de producción
psql $DATABASE_URL_PRODUCTION

# Ejecutar migración
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
```

O desde Render Dashboard:
1. Ve a tu servicio de PostgreSQL
2. Abre la shell
3. Ejecuta el SQL de arriba

---

## Post-Deploy Testing

### Funcionalidades que funcionan SIN Stripe configurado:

✅ Mi Perfil - Editar nombre/apellidos
✅ Mi Perfil - Cambiar contraseña
✅ Mi Perfil - Ver estado membresía
✅ Dashboard - Último vídeo visto
✅ Dashboard - Próximas sesiones

### Funcionalidades que requieren Stripe:

⚠️ Mi Perfil - Gestionar método de pago (dará error hasta configurar)

---

## Cuando Tengas Acceso a Stripe

Sigue los pasos en `STRIPE_SETUP.md`:

1. Configurar Customer Portal en Stripe Dashboard
2. Actualizar `STRIPE_SECRET_KEY` a clave de producción
3. Probar el flujo completo

---

## Archivos Modificados

### Backend
- `auth/authController.ts` - Endpoints perfil y contraseña
- `controllers/videoController.ts` - Último vídeo visto
- `controllers/stripeController.ts` - **NUEVO** Portal de Stripe
- `server.ts` - Nuevas rutas
- `database/migrations/add_stripe_customer_id.sql` - **NUEVO** Migración

### Frontend
- `pages/dashboard/PerfilPage.tsx` - **NUEVO** Página de perfil
- `pages/dashboard/DashboardInicio.tsx` - Mejorado con vídeo y reservas
- `contexts/AuthContext.tsx` - Añadido updateUser
- `App.tsx` - Ruta de perfil

### Documentación
- `STRIPE_SETUP.md` - **NUEVO** Guía de configuración Stripe

---

## Rollback Plan

Si algo falla después del deploy:

```bash
# Revertir al commit anterior
git revert HEAD
git push origin main
```

La migración de DB es segura (solo añade una columna, no modifica datos existentes).

---

## Notas Importantes

- ⚠️ **No olvides ejecutar la migración de DB** después del deploy
- ✅ El código Stripe está preparado pero no causará errores si no está configurado
- ✅ Todas las nuevas funcionalidades son aditivas (no rompen nada existente)
- ✅ Los usuarios existentes seguirán funcionando normalmente
