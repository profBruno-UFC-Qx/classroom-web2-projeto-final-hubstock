import type { Request, Response, NextFunction } from "express";

export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).usuarioRole;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: "Acesso negado. Você não tem permissão para realizar esta ação." 
            });
        }

        next();
    };
};