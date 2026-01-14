import { z } from "zod";

export const usuarioCadastroSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    papel: z.enum(["ADMINISTRADOR", "GARCOM", "SUPERADMINISTRADOR"]).optional(),
    restauranteId: z.uuid("ID de restaurante inválido").optional()
});

// Esquema para o Login
export const loginSchema = z.object({
    email: z.email("E-mail inválido"),
    senha: z.string().min(1, "A senha é obrigatória")
});