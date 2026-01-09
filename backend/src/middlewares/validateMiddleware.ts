import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (erro) {
            if (erro instanceof ZodError) {
                return res.status(400).json({
                    erro: "Dados inválidos",
                    // Usamos 'issues' que é o padrão recomendado pelo Zod
                    detalhes: erro.issues.map(issue => ({
                        campo: issue.path.join("."),
                        mensagem: issue.message
                    }))
                });
            }
            return res.status(500).json({ erro: "Erro interno na validação." });
        }
    };
};