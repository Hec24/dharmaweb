# Cómo Crear Eventos de Prueba

Ya que no tienes acceso al Shell de PostgreSQL en Render (plan gratuito), he creado endpoints de admin que puedes llamar desde tu terminal.

## Paso 1: Ejecutar Migración de Live Events

Primero, crea las tablas en la base de datos:

```bash
curl -X POST https://dharma-en-ruta.onrender.com/api/admin/migrate-live-events \
  -H "x-admin-token: TU_ADMIN_TOKEN_AQUI"
```

**Nota:** Reemplaza `TU_ADMIN_TOKEN_AQUI` con el valor de tu variable de entorno `ADMIN_TOKEN` en Render.

## Paso 2: Crear Eventos de Prueba

Una vez que las tablas estén creadas, ejecuta este comando para crear 4 eventos de prueba:

```bash
curl -X POST https://dharma-en-ruta.onrender.com/api/admin/seed-events \
  -H "x-admin-token: TU_ADMIN_TOKEN_AQUI"
```

Esto creará:
- ✅ **3 eventos próximos** (en 3, 5 y 7 días)
  - Meditación Matutina
  - Taller de Presupuesto Consciente
  - Yoga para Principiantes
- ✅ **1 evento pasado** con grabación
  - Introducción al Dharma

## Verificar que Funcionó

Deberías ver una respuesta como:

```json
{
  "success": true,
  "message": "4 test events created successfully (3 upcoming, 1 past with recording)"
}
```

Luego ve a `/dashboard/directos` y deberías ver los eventos!

## Encontrar tu ADMIN_TOKEN

1. Ve a Render Dashboard
2. Selecciona tu servicio backend
3. Ve a "Environment"
4. Busca la variable `ADMIN_TOKEN`
5. Copia su valor

## Troubleshooting

Si obtienes error 403 (Forbidden):
- Verifica que estás usando el ADMIN_TOKEN correcto
- Asegúrate de que la variable de entorno esté configurada en Render

Si obtienes error 500:
- Las tablas probablemente ya existen
- Intenta solo el paso 2 (seed-events)
