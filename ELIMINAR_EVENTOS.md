# Cómo Eliminar Eventos

Si necesitas eliminar un evento de prueba o cualquier evento:

```bash
curl -X DELETE https://dharma-en-ruta.onrender.com/api/admin/live-events/EVENT_ID_AQUI \
  -H "x-admin-token: TU_ADMIN_TOKEN"
```

Reemplaza:
- `EVENT_ID_AQUI` con el ID del evento (puedes verlo en la URL cuando abres un evento)
- `TU_ADMIN_TOKEN` con tu token de admin

## Ejemplo

Si el evento tiene ID `abc-123-def-456`:

```bash
curl -X DELETE https://dharma-en-ruta.onrender.com/api/admin/live-events/abc-123-def-456 \
  -H "x-admin-token: tu_token_secreto"
```

Deberías recibir una respuesta como:

```json
{
  "success": true,
  "message": "Event \"Nombre del Evento\" deleted successfully"
}
```
