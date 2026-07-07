import { z } from 'zod';

export const iconSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional().default(''),
  pngData: z.string().optional(),
  strokes: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['line', 'curve', 'freehand']),
    points: z.array(z.object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    })).min(2),
    fillColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    strokeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    strokeWidth: z.number().min(1).max(20).default(2),
    gradient: z.object({
      type: z.enum(['linear', 'radial']),
      colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(2).max(10),
      angle: z.number().min(0).max(360).optional(),
    }).optional(),
  })).min(1, 'At least one stroke required'),
  gridSize: z.number().min(8).max(64).default(16),
  canvasWidth: z.number().min(64).max(1024).default(256),
  canvasHeight: z.number().min(64).max(1024).default(256),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const iconUpdateSchema = iconSchema.partial().omit({ createdAt: true });

export const exportSchema = z.object({
  format: z.enum(['png', 'svg']).default('png'),
  scale: z.number().min(1).max(8).default(1),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const gridPointSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  active: z.boolean().default(false),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const selectionSchema = z.object({
  startX: z.number(),
  startY: z.number(),
  endX: z.number(),
  endY: z.number(),
  strokeIds: z.array(z.string().uuid()).optional(),
});

export const zoomSchema = z.object({
  level: z.number().min(0.1).max(10).default(1),
  panX: z.number().default(0),
  panY: z.number().default(0),
});

export type Icon = z.infer<typeof iconSchema>;
export type IconUpdate = z.infer<typeof iconUpdateSchema>;
export type ExportOptions = z.infer<typeof exportSchema>;
export type GridPoint = z.infer<typeof gridPointSchema>;
export type Selection = z.infer<typeof selectionSchema>;
export type ZoomState = z.infer<typeof zoomSchema>;