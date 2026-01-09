import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Venda } from "../entities/Venda.js";

export class ReportController {
    static async loadReports(req: Request, res: Response) {
        const restauranteId = (req as any).usuarioRestauranteId;
        const repo = AppDataSource.getRepository(Venda);

        const vendas = await repo.find({
            where: { restauranteId },
            relations: ["items"],
            order: { data: "DESC" }
        });

        // Métricas traduzidas para o Admin
        const métricasResumo = vendas.reduce((acc, venda) => {
            acc.receitaTotal += Number(venda.totalValor);
            acc.lucroTotal += Number(venda.totalLucro);
            acc.quantidadeVendas += 1;
            return acc;
        }, { receitaTotal: 0, lucroTotal: 0, quantidadeVendas: 0 });

        return res.json({
            resumo: métricasResumo,
            históricoVendas: vendas
        });
    }
}