import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Usuario } from "../entities/Usuario.js";
import bcrypt from "bcryptjs";

export class UsuarioController {
    static async create(req: Request, res: Response) {
        const { nome, email, senha, role, restauranteId } = req.body;
        const papelRequisitante = (req as any).usuarioRole;
        const restauranteIdRequisitante = (req as any).usuarioRestauranteId;

        const repo = AppDataSource.getRepository(Usuario);

        const emailExiste = await repo.findOneBy({ email });
        if (emailExiste) {
            throw new Error("E-mail já cadastrado.");
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        let idRestauranteFinal = restauranteId;

        // ADMIN só cria para o próprio restaurante
        if (papelRequisitante === 'ADMINISTRADOR') {
            idRestauranteFinal = restauranteIdRequisitante;
            if (role === 'SUPERADMINISTRADOR') {
                return res.status(403).json({ erro: "Um Administrador não pode criar um SuperAdmin." });
            }
        }

        const novoUsuario = repo.create({
            nome,
            email,
            senha: hashSenha,
            role: role || 'GARCOM',
            restauranteId: idRestauranteFinal
        });

        await repo.save(novoUsuario);

        const { senha: _, ...dadosUsuario } = novoUsuario;
        return res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            dados: dadosUsuario
        });
    }

    static async list(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Usuario);
        const papelRequisitante = (req as any).usuarioRole;
        const restauranteIdRequisitante = (req as any).usuarioRestauranteId;

        const onde = papelRequisitante === 'SUPERADMINISTRADOR' ? {} : { restauranteId: restauranteIdRequisitante };

        const usuarios = await repo.find({ where: onde });
        return res.json(usuarios);
    }
}