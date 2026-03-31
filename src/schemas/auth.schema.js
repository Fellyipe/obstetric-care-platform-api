import { z } from "zod";
import { emailSchema, passwordSchema } from "./common.schema.js";

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  data: z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").trim(),
  }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token é obrigatório"),
});
