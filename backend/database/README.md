# Instrucciones para ejecutar la migración

## Opción 1: Desde Render Dashboard (Más fácil)

1. Ve a tu base de datos en Render Dashboard
2. Click en **"Connect"** → Copia el comando **"PSQL Command"**
3. Pégalo en tu terminal (te conectará a la base de datos)
4. Una vez conectado, copia y pega el contenido completo del archivo `backend/database/init.sql`
5. Presiona Enter
6. ¡Listo! Las tablas están creadas

## Opción 2: Desde local con .env

1. Crea un archivo `.env` en la carpeta `backend` (si no existe)
2. Añade la línea:
   ```
   DATABASE_URL=postgresql://...
   ```
   (Usa la "External Database URL" que te dio Render)
3. Ejecuta: `npx ts-node database/migrate.ts`

## Verificar que funcionó

Después de ejecutar la migración, verifica que las tablas se crearon:

```sql
\dt
```

Deberías ver:
- users
- videos
- video_progress
- user_preferences

---

**¿Cuál opción prefieres?** La Opción 1 es más rápida si no quieres configurar el .env local.
