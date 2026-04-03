import { z } from "zod";
import { idSchema } from "../common.schema.js";

export const categorySchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(200),
  order: z.number().int().min(1),
  is_active: z.boolean().default(true),
  source: z.enum(["doctor", "system"]),
});

export const contentSchema = z.object({
  category_id: idSchema,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  image_url: z.url().nullable().optional(),
  author_name: z.string().max(100).nullable().optional(),
  author_role: z.string().max(100).nullable().optional(),
  read_time_minutes: z.number().int().min(1).default(3),
  content: z.string().min(1),
  gestational_week: z.number().int().min(1).max(42).nullable().optional(),
  order: z.number().int().min(1),
  is_active: z.boolean().default(true),
  source: z.enum(["doctor", "system"]),
});

export const reorderSchema = z
  .array(
    z.object({
      id: idSchema,
      order: z.number().int().min(1),
    }),
  )
  .min(1, "Lista de reordenação não pode ser vazia");

export const contentFilterSchema = z.object({
  category_id: idSchema.optional(),
  gestational_week: z.coerce.number().int().min(1).max(42).optional(),
  q: z.string().min(2).optional(),
});
