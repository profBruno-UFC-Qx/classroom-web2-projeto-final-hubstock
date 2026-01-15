import { z } from "zod";

export const publicRegisterSchema = z.object({
    nomeRestaurante: z.string().min(3),
    cnpjRestaurante: z.string().min(14),
    nomeAdministrador: z.string().min(3),
    emailAdministrador: z.email("E-mail inválido."),
    senhaAdministrador: z.string().min(6),
    quantidadeMesas: z.number().int().min(1).optional()
});