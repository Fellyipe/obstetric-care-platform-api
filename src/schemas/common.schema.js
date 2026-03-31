import { z } from "zod";

export const idSchema = z.uuid();

export const uuidSchema = z.uuid();

export const emailSchema = z.email("Email inválido").trim();

export const phoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/[^\d+]/g, ""))
  .refine(
    (val) => {
      return /^\+?\d{8,15}$/.test(val);
    },
    {
      message: "Telefone inválido. Use o formato: +5511999999999",
    },
  );

export const passwordSchema = z
  .string()
  .min(6, "Senha deve ter no mínimo 6 caracteres");

export const dateSchema = z.iso.date();

export const datetimeSchema = z.iso.datetime();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
