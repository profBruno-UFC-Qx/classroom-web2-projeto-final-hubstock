import { z } from "zod";

export const aluguelSchema = z.object({
    clienteNome: z.string().min(3, "Nome do cliente é obrigatório"),
    clienteTelefone: z.string().min(10, "Informe um telefone válido com DDD"),
    produtoId: z.number().int().positive(),
    quantidade: z.number().int().positive(),
    limiteHoras: z.number().int().positive("O limite de horas deve ser maior que zero")
});