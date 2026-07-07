import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer, { FileFilterCallback, diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import PocketBase from 'pocketbase';
import { z } from 'zod';

// Extender Request para incluir el archivo de multer
const __zeusFilterObjectToPbFilter = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || Array.isArray(value)) return String(value);

  const entries = Object.entries(value as Record<string, unknown>);
  return entries
    .map(([k, v]) => {
      if (v === null) return k + ' = null';
      if (typeof v === 'number' || typeof v === 'boolean') return k + ' = ' + String(v);
      const escaped = String(v).replace(/'/g, "\'");
      return k + " = '" + escaped + "'";
    })
    .join(' && ');
};

const __zeusCollection = (pb: any, name: string) => {
  const svc = (pb as any).collection(name) as any;

  if (typeof svc.getRecord !== 'function') {
    svc.getRecord = (id: string, options?: any) => svc.getOne(id, options);
  }
  if (typeof svc.createRecord !== 'function') {
    svc.createRecord = (data: any, options?: any) => svc.create(data, options);
  }
  if (typeof svc.updateRecord !== 'function') {
    svc.updateRecord = (id: string, data: any, options?: any) => svc.update(id, data, options);
  }
  if (typeof svc.deleteRecord !== 'function') {
    svc.deleteRecord = (id: string, options?: any) => svc.delete(id, options);
  }
  if (typeof svc.getMany !== 'function') {
    svc.getMany = async (params?: any) => {
      const rawPage = Number(params?.page ?? 1);
      const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
      const rawLimit = Number(params?.limit ?? params?.perPage ?? 30);
      const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 30;
      const options: Record<string, unknown> = {};

      if (params?.sort != null) options.sort = String(params.sort);
      if (params?.expand != null) options.expand = params.expand;
      if (params?.fields != null) options.fields = params.fields;
      if (params?.filter != null) {
        const filter = __zeusFilterObjectToPbFilter(params.filter);
        if (filter) options.filter = filter;
      }

      const res = await svc.getList(page, limit, options);
      return {
        records: Array.isArray(res?.items) ? res.items : [],
        page: typeof res?.page === 'number' ? res.page : page,
        limit: typeof res?.perPage === 'number' ? res.perPage : limit,
        total: typeof res?.totalItems === 'number' ? res.totalItems : 0,
        totalPages: typeof res?.totalPages === 'number' ? res.totalPages : 1
      };
    };
  }

  return svc;
};


declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}


const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cliente PocketBase (puerto dinámico)
const pb = new PocketBase(process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL || process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8357');

// Esquemas Zod para validación
const IconCreateSchema = z.object({
  name: z.string().min(1),
  data: z.record(z.any()),
});

const IconUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  data: z.record(z.any()).optional(),
});

// Tipo Icon (seguro para PocketBase)
interface Icon {
  id: string;
  name: string;
  data: Record<string, any>;
  created?: string;
  updated?: string;
}

// Configuración de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Custom ICON 1.1 API',
    version: '1.0.0',
    description: 'API para gestión de iconos con soporte de colores y edición', // texto corto, una línea
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Servidor local',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./*.ts', './api.ts', './src/*.ts'], // incluye el archivo principal
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: ".swagger-ui .info .title{font-size:1.5rem!important;line-height:1.3;font-weight:600}.swagger-ui .info .description{font-size:.875rem!important;line-height:1.55!important;max-width:56rem;color:#3b4151;font-weight:400}.swagger-ui .info .description p{margin:.45em 0}.swagger-ui .info .description ul,.swagger-ui .info .description ol{margin:.4em 0 .4em 1.15em}.swagger-ui .info .description h1,.swagger-ui .info .description h2,.swagger-ui .info .description h3,.swagger-ui .info .description h4{font-size:1rem!important;font-weight:600!important;margin:.7em 0 .35em!important;line-height:1.35!important}" }));

// Configuración de Multer para importar archivos
const storage = diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.svg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'image/svg+xml' || file.originalname.endsWith('.svg')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos SVG'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * @swagger
 * /api/icons:
 *   get:
 *     summary: Listar todos los iconos
 *     description: Obtiene la lista completa de iconos almacenados
 *     tags: [Icons]
 *     responses:
 *       200:
 *         description: Lista de iconos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *                   data: { type: object }
 */
app.get('/api/icons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await __zeusCollection(pb, 'icons').getMany();
    const icons: Icon[] = records as unknown as Icon[];
    res.json(icons);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/icons/{id}:
 *   get:
 *     summary: Obtener un icono por ID
 *     description: Devuelve un icono específico a partir de su identificador
 *     tags: [Icons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del icono
 *     responses:
 *       200:
 *         description: Icono encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 name: { type: string }
 *                 data: { type: object }
 *       404:
 *         description: Icono no encontrado
 */
app.get('/api/icons/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const record = await __zeusCollection(pb, 'icons').getOne(req.params.id);
    const icon: Icon = record as unknown as Icon;
    res.json(icon);
  } catch (error: any) {
    if (error?.status === 404) {
      res.status(404).json({ message: 'Icono no encontrado' });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/icons:
 *   post:
 *     summary: Crear un nuevo icono
 *     description: Crea un icono enviando datos en JSON
 *     tags: [Icons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - data
 *             properties:
 *               name: { type: string }
 *               data: { type: object }
 *     responses:
 *       201:
 *         description: Icono creado
 *       400:
 *         description: Datos inválidos
 */
app.post('/api/icons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = IconCreateSchema.parse(req.body);
    const record = await __zeusCollection(pb, 'icons').create(parsed);
    const icon: Icon = record as unknown as Icon;
    res.status(201).json(icon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Error de validación', errors: error.errors });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/icons/{id}:
 *   put:
 *     summary: Actualizar completamente un icono
 *     description: Reemplaza todos los campos del icono especificado
 *     tags: [Icons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del icono
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - data
 *             properties:
 *               name: { type: string }
 *               data: { type: object }
 *     responses:
 *       200:
 *         description: Icono actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Icono no encontrado
 */
app.put('/api/icons/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = IconCreateSchema.parse(req.body);
    const record = await __zeusCollection(pb, 'icons').update(req.params.id, parsed);
    const icon: Icon = record as unknown as Icon;
    res.json(icon);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    if (error?.status === 404) {
      return res.status(404).json({ message: 'Icono no encontrado' });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/icons/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un icono
 *     description: Actualiza los campos enviados, sin modificar los demás
 *     tags: [Icons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del icono
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               data: { type: object }
 *     responses:
 *       200:
 *         description: Icono actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Icono no encontrado
 */
app.patch('/api/icons/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = IconUpdateSchema.parse(req.body);
    const record = await __zeusCollection(pb, 'icons').update(req.params.id, parsed);
    const icon: Icon = record as unknown as Icon;
    res.json(icon);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    if (error?.status === 404) {
      return res.status(404).json({ message: 'Icono no encontrado' });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/icons/{id}:
 *   delete:
 *     summary: Eliminar un icono
 *     description: Borra el icono indicado por su ID
 *     tags: [Icons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del icono
 *     responses:
 *       200:
 *         description: Icono eliminado
 *       404:
 *         description: Icono no encontrado
 */
app.delete('/api/icons/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await __zeusCollection(pb, 'icons').delete(req.params.id);
    res.json({ message: 'Icono eliminado', id: req.params.id });
  } catch (error: any) {
    if (error?.status === 404) {
      res.status(404).json({ message: 'Icono no encontrado' });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/icons/import:
 *   post:
 *     summary: Importar un icono desde archivo SVG
 *     description: Sube un archivo SVG y lo convierte en un nuevo icono
 *     tags: [Icons]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 description: Nombre personalizado (opcional)
 *     responses:
 *       201:
 *         description: Icono importado exitosamente
 *       400:
 *         description: Archivo no válido
 */
app.post('/api/icons/import', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }
    const filePath = req.file.path;
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    const name = req.body.name || path.basename(req.file.originalname, path.extname(req.file.originalname));
    const iconData = { svg: svgContent };
    const record = await __zeusCollection(pb, 'icons').create({ name, data: iconData });
    const icon: Icon = record as unknown as Icon;
    // Opcional: eliminar el archivo temporal después de procesarlo
    fs.unlinkSync(filePath);
    res.status(201).json(icon);
  } catch (error) {
    next(error);
  }
});

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor API ejecutándose en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
