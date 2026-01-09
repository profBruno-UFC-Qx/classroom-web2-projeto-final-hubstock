import { z } from "zod";
import { UnidadeMedida, CategoriaProduto } from "../types/index.js";

export const produtoSchema = z.object({
    nomeProduto: z.string().min(2, "Nome do produto obrigatório"),
    unidadeMedidaProduto: z.enum(Object.values(UnidadeMedida) as [string, ...string[]]),
    categoriaProduto: z.enum(Object.values(CategoriaProduto) as [string, ...string[]]),
    precoCustoProduto: z.number().nonnegative("Custo não pode ser negativo"),
    precoVendaProduto: z.number().positive("Preço de venda deve ser maior que zero"),
    estoqueAtual: z.number().int().default(0),
    isLocacao: z.boolean().default(false),
    urlImagemProduto: z.string().refine((url) => !url || /^https?:\/\/.+/.test(url), "URL da imagem inválida").optional().or(z.literal(""))
});