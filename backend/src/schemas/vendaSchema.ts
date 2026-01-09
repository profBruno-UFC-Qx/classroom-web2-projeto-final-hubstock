import { z } from "zod";

export const vendaItemSchema = z.object({
    produtoId: z.number({ message: "ID do produto é obrigatório" }).int().positive(),
    quantidade: z.number().int().positive("A quantidade deve ser no mínimo 1")
});

export const vendaSchema = z.object({
    itens: z.array(vendaItemSchema).min(1, "A venda deve ter pelo menos um item")
});