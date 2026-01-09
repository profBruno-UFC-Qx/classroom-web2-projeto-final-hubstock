import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Restaurante } from "../entities/Restaurante.js";

export class RestauranteController {
    static async listAll(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Restaurante);
        const restaurantes = await repo.find();
        return res.json(restaurantes);
    }

    static async create(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Restaurante);
        const novo = repo.create(req.body);
        await repo.save(novo);
        return res.status(201).json({
            mensagem: "Restaurante cadastrado com sucesso",
            dados: novo
        });
    }
}