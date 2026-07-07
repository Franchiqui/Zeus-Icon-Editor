# Custom ICON 1.1 API

Aplicación web En la que puede importar Una biblioteca de iconos y pueda Editarlos, Funcionalidad Para poder implementarle A los iconos Dos y 3 colores Hacer iconos tricolor O bicolor Con un editor con herramientas Para poder editar la forma de los iconos Todas las herramientas típicas de un editor de dibujo Tanto para dibujar Como para seleccionar Copiar y pegar Seleccionar vértices Y poder editar los vértices Editar el tamaño del icono Poder cambiarle el color a los trazos Y al fondo Y una vez terminado Poder volver a importarlos en una aplicación Con todos los cambios realizados El lienzo de la interfaz Duncolor gris oscuro Con líneas de puntos horizontales y verticales Magnetizados Pudiendo evitar la distancia entre los puntos horizontales y verticales Interfaz de la aplicación De tema oscuro Colores degradados Columna de herramientas a la izquierda Vértic Y funcionalidades En columna de la derecha Poder crear pestañas Para tener varios archivos abiertos Botones para cargar Archivos de almacenamiento interno Y para guardar O exportar Todo conectado mediante una API A una base de dato local de pocket base Donde se podrán lis De crear actualizar y borrar


## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

## Documentación API

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