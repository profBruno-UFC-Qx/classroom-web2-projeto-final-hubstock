import { z } from "zod";
import { UsuarioPapel } from "../types/index.js";

export const usuarioCadastroSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    role: z.enum(Object.values(UsuarioPapel) as [string, ...string[]]).optional(),
    restauranteId: z.number().int().positive().optional()
});

// Esquema para o Login
export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(1, "A senha é obrigatória")
});