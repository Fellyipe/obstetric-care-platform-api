import { z } from "zod";
import {
  datetimeSchema,
  idSchema,
  paginationSchema,
} from "../common.schema.js";

export const createDiaryEntrySchema = z.object({
  pregnancy_id: idSchema,
  content: z.string().trim().optional().nullable(),
  entry_date: datetimeSchema.optional(),
  feeling: z.number().int().min(0).max(4),
});

export const updateDiaryEntrySchema = createDiaryEntrySchema
  .omit({ pregnancy_id: true })
  .partial();

export const listDiaryEntriesQuerySchema = z
  .object({
    pregnancy_id: idSchema,
    week: z.coerce.number().int().min(1).max(50).optional(),
  })
  .extend(paginationSchema.shape);
