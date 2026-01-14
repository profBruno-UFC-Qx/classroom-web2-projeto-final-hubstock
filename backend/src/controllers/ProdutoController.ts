import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Produto } from "../entities/Produto.js";
import { MovimentacaoEstoque } from "../entities/MovimentacaoEstoque.js";
import { TipoMovimentacaoEstoque } from "../types/index.js";
import { Like } from "typeorm";

export class ProdutoController {

    // Lista os produtos do restaurante (da pra filtrar pelo nome)
    static async list(req: Request, res: Response) {
        const restId = (req as any).usuarioRestauranteId;
        const busca = req.query['busca'] as string;

        const repo = AppDataSource.getRepository(Produto);

        try {
            // prepara o filtro basico por restaurante
            let onde: any = { restauranteId: restId };

            // se mandarem algo na busca, filtra pelo nome usando Like
            if (busca) {
                onde.nomeProduto = Like(`%${busca}%`);
            }

            const lista = await repo.find({
                where: onde,
                order: { nomeProduto: "ASC" }
            });

            return res.json(lista);
        } catch (err) {
            console.log("Erro ao listar produtos:", err);
            return res.status(500).json({ erro: "Nao deu pra carregar os produtos" });
        }
    }

    // Pega só um produto pelo ID
    static async getById(req: Request, res: Response) {
        const restId = (req as any).usuarioRestauranteId;
        const repo = AppDataSource.getRepository(Produto);

        const prod = await repo.findOneBy({
            id: String(req.params['id']),
            restauranteId: restId
        });

        if (!prod) return res.status(404).json({ erro: "Produto sumiu ou nao existe" });

        return res.json(prod);
    }

    // Cria um produto novo vinculado ao restaurante logado
    static async create(req: Request, res: Response) {
        const restId = (req as any).usuarioRestauranteId;
        const repo = AppDataSource.getRepository(Produto);

        const novo = repo.create({
            ...req.body,
            restauranteId: restId
        });

        await repo.save(novo);
        return res.status(201).json(novo);
    }

    // Atualiza os dados do produto (preco, nome, ...)
    static async update(req: Request, res: Response) {
        const restId = (req as any).usuarioRestauranteId;
        const repo = AppDataSource.getRepository(Produto);
        const { id } = req.params;

        // olha se o produto é mesmo desse restaurante
        const existe = await repo.findOneBy({ id: String(id), restauranteId: restId });
        if (!existe) return res.status(404).json({ erro: "Produto nao encontrado" });

        await repo.update(String(id), req.body);
        return res.json({ mensagem: "Produto atualizado!" });
    }

    // Deleta o produto do banco
    static async delete(req: Request, res: Response) {
        const restId = (req as any).usuarioRestauranteId;
        const repo = AppDataSource.getRepository(Produto);
        const { id } = req.params;

        const existe = await repo.findOneBy({ id: String(id), restauranteId: restId });
        if (!existe) return res.status(404).json({ erro: "Produto nao encontrado" });

        await repo.delete(String(id));
        return res.status(204).send();
    }

    // Mexe no estoque (entrada ou saida) e guarda o log
    static async updateStock(req: Request, res: Response) {
        const { id } = req.params;
        const { quantidade, tipo, observacao } = req.body;
        const userId = (req as any).usuarioId;
        const restId = (req as any).usuarioRestauranteId;

        const repoProd = AppDataSource.getRepository(Produto);
        const repoLog = AppDataSource.getRepository(MovimentacaoEstoque);

        try {
            const prod = await repoProd.findOneBy({ id: String(id), restauranteId: restId });

            if (!prod) return res.status(404).json({ erro: "Produto nao existe" });

            const qtd = Number(quantidade);

            // Ve se é entrada ou saida e faz a conta
            if (tipo === TipoMovimentacaoEstoque.ENTRADA) {
                prod.estoqueAtual += qtd;
            } else {
                // se for saida, checa se tem o suficiente
                if (prod.estoqueAtual < qtd) {
                    return res.status(400).json({ erro: "Nao tem estoque suficiente" });
                }
                prod.estoqueAtual -= qtd;
            }

            await repoProd.save(prod);

            // cria o registro da movimentacao pra n se perder dps
            const log = repoLog.create({
                tipo,
                quantidade: qtd,
                observacao: observacao || "",
                produtoId: String(id),
                responsavelId: String(userId)
            });
            await repoLog.save(log);

            return res.json({ mensagem: "Estoque atualizado!", novoTotal: prod.estoqueAtual });

        } catch (err) {
            console.log("Erro no estoque:", err);
            return res.status(500).json({ erro: "Erro ao mexer no estoque" });
        }
    }
}