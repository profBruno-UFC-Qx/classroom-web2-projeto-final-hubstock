import type { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Usuario } from "../entities/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {

    static async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        const repository = AppDataSource.getRepository(Usuario);

        // Busca o usuário incluindo a senha
        const usuario = await repository.findOne({
            where: { email },
            select: ["id", "nome", "email", "senha", "role", "restauranteId"]
        });

        if (!usuario) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        // Compara a senha enviada com o hash no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        // Gera o Token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                papel: usuario.role,
                nome: usuario.nome,
                restauranteId: usuario.restauranteId
            },
            process.env["JWT_SECRET"] || "sua_chave_secreta",
            { expiresIn: "1d" }
        );

        return res.json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                papel: usuario.role,
                restauranteId: usuario.restauranteId
            },
            token
        });
    }
}