// Esquemas Zod utilizados
// IconCreateSchema
const IconCreateSchema = z.object({
  name: z.string().min(1),
  data: z.record(z.any()),
});

// IconUpdateSchema
const IconUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  data: z.record(z.any()).optional(),
});