# Stripe Customer Portal - Setup Guide

## Overview

Implementación del Stripe Customer Portal para permitir a los usuarios gestionar sus métodos de pago desde la página de perfil.

---

## 1. Migración de Base de Datos

### Ejecutar la Migración

Necesitas añadir el campo `stripe_customer_id` a la tabla `users`:

```bash
# Conectar a tu base de datos PostgreSQL
psql $DATABASE_URL

# Ejecutar la migración
\i backend/database/migrations/add_stripe_customer_id.sql

# Verificar que se añadió correctamente
\d users
```

O ejecutar directamente:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
```

---

## 2. Configurar Stripe Customer Portal

### Paso 1: Acceder al Dashboard de Stripe

1. Ve a [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Asegúrate de estar en el entorno correcto (Test/Live)

### Paso 2: Configurar el Customer Portal

1. Navega a **Settings** → **Customer Portal**
2. O accede directamente: [https://dashboard.stripe.com/settings/billing/portal](https://dashboard.stripe.com/settings/billing/portal)

### Paso 3: Configuración Recomendada

#### **Funcionalidades a Activar:**

- ✅ **Update payment methods** - Permitir actualizar tarjetas
- ✅ **View invoices** - Ver facturas
- ✅ **Download invoices** - Descargar recibos
- ✅ **Update billing information** - Actualizar datos de facturación

#### **Funcionalidades Opcionales:**

- ⚠️ **Cancel subscriptions** - Solo si usas suscripciones recurrentes
- ⚠️ **Update subscriptions** - Solo si permites cambios de plan

#### **Configuración de Marca:**

- **Business name**: Dharma en Ruta
- **Support email**: info@dharmaenruta.com (o tu email de soporte)
- **Privacy policy URL**: https://dharmaenruta.com/politica-privacidad
- **Terms of service URL**: https://dharmaenruta.com/terminos

#### **Idioma:**

- Selecciona **Español** como idioma predeterminado

### Paso 4: Guardar Configuración

Haz clic en **Save** para aplicar los cambios.

---

## 3. Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... # o sk_live_... en producción
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (para el return_url del portal)
FRONTEND_URL=https://dharmaenruta.com # o http://localhost:5173 en desarrollo
```

---

## 4. Flujo de Funcionamiento

### Primera Vez que un Usuario Accede

1. Usuario hace clic en "Gestionar método de pago"
2. Backend verifica si el usuario tiene `stripe_customer_id`
3. Si NO existe:
   - Se crea un nuevo Customer en Stripe
   - Se guarda el `customer_id` en la base de datos
4. Se genera una sesión del Customer Portal
5. Usuario es redirigido a `billing.stripe.com`
6. Usuario gestiona sus métodos de pago
7. Al terminar, es redirigido de vuelta a `/dashboard/perfil`

### Visitas Posteriores

1. Usuario hace clic en "Gestionar método de pago"
2. Backend usa el `stripe_customer_id` existente
3. Se genera sesión del portal
4. Usuario es redirigido directamente

---

## 5. Integración con Pagos Existentes

### Actualizar Webhook de Stripe

Para vincular automáticamente los pagos con los customers, actualiza tu webhook en `server.ts`:

```typescript
// En el webhook de checkout.session.completed
if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session.customer_email;
    
    // Buscar usuario
    const userResult = await pool.query(
        'SELECT id, nombre, apellidos FROM users WHERE email = $1',
        [userEmail]
    );
    
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        // Si el session tiene un customer, guardarlo
        if (session.customer) {
            await pool.query(
                'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
                [session.customer, user.id]
            );
        }
    }
}
```

### Crear Checkout Sessions con Customer

Cuando crees nuevas sesiones de pago, usa el customer existente:

```typescript
// Obtener o crear customer
const customerId = await getOrCreateCustomer(
    userId, 
    userEmail, 
    nombre, 
    apellidos
);

// Crear checkout session
const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId, // ← Usar customer existente
    line_items: [...],
    success_url: `${FRONTEND_URL}/gracias`,
    cancel_url: `${FRONTEND_URL}/cancelado`,
});
```

---

## 6. Testing

### Test Mode (Desarrollo)

1. Usa las claves de test de Stripe (`sk_test_...`)
2. Tarjetas de prueba:
   - **Éxito**: `4242 4242 4242 4242`
   - **Requiere autenticación**: `4000 0025 0000 3155`
   - **Declinada**: `4000 0000 0000 9995`
3. Cualquier fecha futura y CVC de 3 dígitos

### Verificar Funcionamiento

```bash
# 1. Iniciar backend
cd backend && npm run dev

# 2. Iniciar frontend
cd frontend && npm run dev

# 3. Probar flujo completo:
# - Login en /login
# - Ir a /dashboard/perfil
# - Clic en "Gestionar método de pago"
# - Verificar redirección a Stripe
# - Añadir tarjeta de prueba
# - Verificar redirección de vuelta
```

### Logs para Debugging

El backend logea información útil:

```
[STRIPE] Creating new customer for user: user@example.com
[STRIPE] Customer created: cus_xxxxx
[STRIPE] Portal session created for customer: cus_xxxxx
```

---

## 7. Producción

### Checklist Pre-Lanzamiento

- [ ] Migración de base de datos ejecutada en producción
- [ ] Variables de entorno actualizadas con claves de producción
- [ ] Customer Portal configurado en modo Live
- [ ] Webhook actualizado para vincular customers
- [ ] Probado flujo completo en staging
- [ ] Verificado que return_url apunta a dominio de producción

### Activar en Producción

1. Cambia a las claves de producción en Stripe Dashboard
2. Actualiza `STRIPE_SECRET_KEY` en variables de entorno
3. Verifica que `FRONTEND_URL` sea tu dominio de producción
4. Configura el Customer Portal en modo Live
5. Prueba con una tarjeta real (pequeña cantidad)

---

## 8. Seguridad

### Buenas Prácticas Implementadas

✅ **No almacenamos datos de tarjetas** - Todo lo maneja Stripe
✅ **Autenticación requerida** - Solo usuarios autenticados pueden acceder
✅ **Customer ID vinculado a usuario** - Cada usuario tiene su propio customer
✅ **HTTPS obligatorio** - Stripe requiere conexiones seguras
✅ **Tokens de sesión temporales** - Las sesiones del portal expiran

### Datos que SÍ Almacenamos

- `stripe_customer_id`: ID del customer en Stripe (no sensible)
- Vinculado al `user_id` en nuestra base de datos

### Datos que NO Almacenamos

- ❌ Números de tarjeta
- ❌ CVV
- ❌ Fechas de expiración
- ❌ Información bancaria

---

## 9. Troubleshooting

### Error: "Customer not found"

**Causa**: El `stripe_customer_id` en la DB no existe en Stripe

**Solución**:
```sql
-- Resetear el customer_id para que se cree uno nuevo
UPDATE users SET stripe_customer_id = NULL WHERE id = 'user_id';
```

### Error: "Invalid API key"

**Causa**: Clave de Stripe incorrecta o no configurada

**Solución**:
- Verifica que `STRIPE_SECRET_KEY` esté en `.env`
- Asegúrate de usar la clave correcta (test/live)

### Portal no redirige de vuelta

**Causa**: `return_url` mal configurado

**Solución**:
- Verifica que `FRONTEND_URL` en `.env` sea correcto
- Debe incluir el protocolo (`https://` o `http://`)
- No debe terminar con `/`

### Usuario no puede ver sus pagos

**Causa**: Los pagos no están vinculados al customer

**Solución**:
- Actualiza el webhook para vincular pagos existentes
- Usa `customer` en futuras checkout sessions

---

## 10. Recursos Adicionales

### Documentación Oficial

- [Stripe Customer Portal Docs](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Customer Portal API Reference](https://stripe.com/docs/api/customer_portal)
- [Testing Guide](https://stripe.com/docs/testing)

### Soporte

- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- Stripe Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)

---

## Resumen de Archivos Modificados

### Backend
- ✅ `database/migrations/add_stripe_customer_id.sql` - Migración de DB
- ✅ `controllers/stripeController.ts` - Lógica del portal
- ✅ `server.ts` - Ruta del endpoint

### Frontend
- ✅ `pages/dashboard/PerfilPage.tsx` - UI del portal

### Endpoints Nuevos
- `POST /api/stripe/create-portal-session` - Genera sesión del portal
