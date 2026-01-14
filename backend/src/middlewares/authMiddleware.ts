import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { TokenPayload } from "../types/index.js";

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
        const secret = process.env["JWT_SECRET"] || "chave_secreta_hubstock";
        const decoded = jwt.verify(token!, secret) as TokenPayload;

        req.usuarioId = decoded.id;
        req.usuarioNome = decoded.nome;
        req.usuarioRole = decoded.papel;
        req.usuarioRestauranteId = decoded.restauranteId;
        (req as any).usuarioNome = decoded.nome;

        return next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};