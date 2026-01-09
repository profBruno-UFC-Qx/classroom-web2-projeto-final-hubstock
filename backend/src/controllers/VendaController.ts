import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Venda } from "../entities/Venda.js";
import { VendaItem } from "../entities/VendaItem.js";
import { Produto } from "../entities/Produto.js";

export class VendaController {

    static async create(req: Request, res: Response) {
        const { itens } = req.body;
        const usuarioId = (req as any).usuarioId;
        const nomeUsuario = (req as any).usuarioNome;
        const restauranteId = (req as any).usuarioRestauranteId;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let valorTotalBruto = 0;
            let custoTotalVenda = 0;
            let lucroTotalVenda = 0;
            const itensParaSalvar: VendaItem[] = [];

            for (const item of itens) {
                const produto = await queryRunner.manager.findOneBy(Produto, { id: item.produtoId });

                if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);

                if (produto.estoqueAtual < item.quantidade) {
                    throw new Error(`Estoque insuficiente para o produto: ${produto.nomeProduto}`);
                }

                // Cálculos baseados nas novas colunas em português
                const valorVendaDoItem = Number(produto.precoVendaProduto) * item.quantidade;
                const valorCustoDoItem = Number(produto.precoCustoProduto) * item.quantidade;
                const lucroDoItem = valorVendaDoItem - valorCustoDoItem;

                valorTotalBruto += valorVendaDoItem;
                custoTotalVenda += valorCustoDoItem;
                lucroTotalVenda += lucroDoItem;

                // Atualiza estoque
                produto.estoqueAtual -= item.quantidade;
                await queryRunner.manager.save(produto);

                // Prepara o item da venda com nomes em português
                const vendaItem = queryRunner.manager.create(VendaItem, {
                    nomeProduto: produto.nomeProduto,
                    quantidade: item.quantidade,
                    precoVenda: produto.precoVendaProduto,
                    precoCusto: produto.precoCustoProduto,
                    totalLucro: lucroDoItem
                });
                itensParaSalvar.push(vendaItem);
            }

            // Cria a venda principal
            const novaVenda = queryRunner.manager.create(Venda, {
                usuarioId,
                nomeUsuario: nomeUsuario || "Vendedor",
                restauranteId,
                totalValor: valorTotalBruto,
                totalCusto: custoTotalVenda,
                totalLucro: lucroTotalVenda,
                items: itensParaSalvar
            });

            await queryRunner.manager.save(novaVenda);
            await queryRunner.commitTransaction();

            return res.status(201).json({
                mensagem: "Venda realizada com sucesso",
                dados: novaVenda
            });

        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ erro: error.message });
        } finally {
            await queryRunner.release();
        }
    }
}