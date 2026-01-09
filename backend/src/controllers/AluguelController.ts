import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Aluguel } from "../entities/Aluguel.js";
import { Produto } from "../entities/Produto.js";

export class AluguelController {
    // Cria a locação
    static async create(req: Request, res: Response) {
        const { clienteNome, clienteTelefone, limiteHoras } = req.body;
        const produtoId = Number(req.body.produtoId);
        const quantidade = Number(req.body.quantidade);

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const produtoRepo = queryRunner.manager.getRepository(Produto);
            const aluguelRepo = queryRunner.manager.getRepository(Aluguel);

            const produto = await produtoRepo.findOneBy({ id: produtoId });

            if (!produto) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            if (produto.estoqueAtual < quantidade) {
                return res.status(400).json({ erro: "Estoque insuficiente para locação" });
            }

            // Tira do estoque
            produto.estoqueAtual -= quantidade;
            await queryRunner.manager.save(produto);

            // Cria o registro de aluguel
            const novaLocacao = aluguelRepo.create({
                clienteNome,
                clienteTelefone,
                produtoId,
                produtoNome: produto.nomeProduto,
                produtoFotoUrl: produto.urlImagemProduto,
                quantidade,
                limiteHoras,
                status: 'ATIVO'
            });

            await aluguelRepo.save(novaLocacao);

            await queryRunner.commitTransaction();
            return res.status(201).json({
                mensagem: "Locação criada com sucesso",
                dados: novaLocacao
            });
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            return res.status(500).json({ erro: "Erro ao processar locação" });
        } finally {
            await queryRunner.release();
        }
    }

    // Lista as locações
    static async list(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Aluguel);
        const { status } = req.query;

        const onde: any = {};
        if (status) onde.status = status;

        const locacoes = await repo.find({
            where: onde,
            order: { dataInicio: "DESC" }
        });

        return res.json(locacoes);
    }

    // Finaliza a locação
    static async finalize(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Aluguel);
        const produtoRepo = AppDataSource.getRepository(Produto);
        const { id } = req.params;

        const locacao = await repo.findOneBy({ id: Number(id) });

        if (!locacao || locacao.status === 'FINALIZADO') {
            return res.status(404).json({ erro: "Locação não encontrada ou já finalizada" });
        }

        locacao.status = 'FINALIZADO';
        locacao.dataFim = new Date();

        // Devolve o produto ao estoque
        const produto = await produtoRepo.findOneBy({ id: locacao.produtoId });
        if (produto) {
            produto.estoqueAtual += locacao.quantidade;
            await produtoRepo.save(produto);
        }

        await repo.save(locacao);
        return res.json({
            mensagem: "Locação finalizada com sucesso",
            dados: locacao
        });
    }
}