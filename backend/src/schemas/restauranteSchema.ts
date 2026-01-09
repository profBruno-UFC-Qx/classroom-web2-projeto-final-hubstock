import { z } from "zod";

export const restauranteSchema = z.object({
    nomeRestaurante: z.string().min(3, "O nome do restaurante deve ser descritivo"),
    cnpjRestaurante: z.string().length(18, "CNPJ deve seguir o formato 00.000.000/0000-00"),
    urlImagemPerfilRestaurante: z.string().refine((url) => !url || /^https?:\/\/.+/.test(url), "URL da imagem inválida").optional().or(z.literal(""))
});