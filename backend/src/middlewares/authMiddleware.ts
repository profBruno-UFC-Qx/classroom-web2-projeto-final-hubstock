import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            usuarioId: number;
            usuarioNome: string;
            usuarioRole: string;
            usuarioRestauranteId: number;
        }
    }
}

interface TokenPayload {
    id: number;
    role: string;
    nome: string;
    iat: number;
    exp: number;
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    // O formato é "Bearer TOKEN"
    const [, token] = authHeader.split(" ");

    try {
        const secret = process.env["JWT_SECRET"] || "sua_chave_secreta";
        const decoded = jwt.verify(token!, secret);

        const { id, role, nome } = decoded as TokenPayload;

        req.usuarioId = id;
        req.usuarioNome = nome;
        req.usuarioRole = role;
        req.usuarioRestauranteId = (decoded as any).restauranteId;

        return next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};