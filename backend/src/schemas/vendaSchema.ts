import { z } from "zod";

export const vendaItemSchema = z.object({
    produtoId: z.uuid("ID do produto inválido"),
    quantidade: z.number().int().positive("Quantidade mínima é 1")
});

export const vendaSchema = z.object({
    itens: z.array(vendaItemSchema).min(1, "A venda deve ter pelo menos um item")
});