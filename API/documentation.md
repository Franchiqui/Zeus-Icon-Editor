# Custom ICON 1.1 API Documentation

## Introducción
Esta API REST permite gestionar una biblioteca de iconos con soporte para colores y edición. Se conecta a una instancia de PocketBase como base de datos local.

## Requisitos previos
- Node.js 16+
- PocketBase corriendo en un puerto accesible (definido en variable de entorno `PB_URL` o `NEXT_PUBLIC_PB_URL`)

## Instalación
```bash
npm install express cors swagger-jsdoc swagger-ui-express multer pocketbase zod
```

## Inicio
```bash
ts-node api.ts
```

## Estructura de datos
Cada icono se almacena con:
- `id`: string (generado por PocketBase)
- `name`: string (nombre descriptivo)
- `data`: object (contiene el diseño, colores, vértices, etc.)

## Endpoints

### GET /api/icons
Obtiene todos los iconos.

### GET /api/icons/:id
Obtiene un icono por su ID.

### POST /api/icons
Crea un nuevo icono. Body: `{ "name": "...", "data": { ... } }`.

### PUT /api/icons/:id
Reemplaza completamente un icono existente.

### PATCH /api/icons/:id
Actualiza campos específicos de un icono.

### DELETE /api/icons/:id
Elimina un icono.

### POST /api/icons/import
Importa un icono desde un archivo SVG. Envía el archivo como `multipart/form-data` con clave `file`. Opcionalmente `name` para definir un nombre personalizado.

## Swagger
La documentación interactiva está en `/api-docs`.

## Manejo de errores
La API responde con códigos de estado HTTP estándar y un objeto JSON con `message` y detalles adicionales cuando es necesario.