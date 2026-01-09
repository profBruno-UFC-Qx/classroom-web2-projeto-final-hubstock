import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Produto } from "../entities/Produto.js";
import { Like } from "typeorm";

export class ProdutoController {
    // Lista todos com filtro opcional por nome ou locação
    static async list(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        const { nome, isLocacao } = req.query;

        const onde: any = { where: {} };
        if (nome) onde.where.nomeProduto = Like(`%${nome}%`);
        if (isLocacao) onde.where.isLocacao = isLocacao === "true";

        const produtos = await repo.find(onde);
        return res.json(produtos);
    }

    // Busca por ID
    static async getById(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        const produto = await repo.findOneBy({ id: Number(req.params['id']) });
        return produto ? res.json(produto) : res.status(404).json({ erro: "Produto não encontrado." });
    }

    // Cria o produto
    static async create(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        const novoProduto = repo.create(req.body);
        await repo.save(novoProduto);
        return res.status(201).json({
            mensagem: "Produto criado com sucesso",
            dados: novoProduto
        });
    }

    // Edita o produto
    static async update(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        const { id } = req.params;
        await repo.update(Number(id), req.body);
        return res.json({ mensagem: "Produto atualizado com sucesso" });
    }

    // Exclui o produto
    static async delete(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        await repo.delete(Number(req.params['id']));
        return res.status(204).send();
    }

    // Entrada de estoque
    static async addStock(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Produto);
        const { id } = req.params;
        const { quantidade } = req.body;

        const produto = await repo.findOneBy({ id: Number(id) });
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

        produto.estoqueAtual += Number(quantidade);
        await repo.save(produto);

        return res.json({
            mensagem: "Estoque atualizado com sucesso",
            estoqueAtual: produto.estoqueAtual
        });
    }
}