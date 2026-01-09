import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AluguelController } from "../controllers/AluguelController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { VendaController } from "../controllers/VendaController.js";
import { ReportController } from "../controllers/ReportController.js";
import { RestauranteController } from "../controllers/RestauranteController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { usuarioCadastroSchema } from "../schemas/usuarioSchema.js";
import { vendaSchema } from "../schemas/vendaSchema.js";
import { aluguelSchema } from "../schemas/aluguelSchema.js";
import { restauranteSchema } from "../schemas/restauranteSchema.js";

const routes = Router();

// AUTENTICAÇÃO
routes.post("/login", AuthController.login);


// RESTAURANTES
routes.get(
    "/restaurantes",
    authMiddleware,
    authorize(['SUPERADMINISTRADOR']),
    RestauranteController.listAll
);
routes.post(
    "/restaurantes",
    authMiddleware,
    authorize(['SUPERADMINISTRADOR']),
    validate(restauranteSchema),
    RestauranteController.create
);


// USUÁRIOS
routes.post(
    "/usuarios",
    authMiddleware,
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']),
    validate(usuarioCadastroSchema),
    UsuarioController.create
);
routes.get(
    "/usuarios",
    authMiddleware,
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']),
    UsuarioController.list
);


// ALUGUEL
routes.post(
    "/alugueis",
    authMiddleware,
    validate(aluguelSchema),
    AluguelController.create
);
routes.get(
    "/alugueis",
    authMiddleware,
    AluguelController.list
);
routes.patch(
    "/alugueis/:id/finalizar",
    authMiddleware,
    AluguelController.finalize
);


// PRODUTOS
routes.get("/produtos", authMiddleware, ProdutoController.list);
routes.get("/produtos/:id", authMiddleware, ProdutoController.getById);

routes.post(
    "/produtos", 
    authMiddleware, 
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']), 
    ProdutoController.create
);
routes.put(
    "/produtos/:id", 
    authMiddleware, 
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']), 
    ProdutoController.update
);
routes.delete(
    "/produtos/:id", 
    authMiddleware, 
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']), 
    ProdutoController.delete
);
routes.patch(
    "/produtos/:id/estoque", 
    authMiddleware, 
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']), 
    ProdutoController.addStock
);

routes.post(
    "/vendas", 
    authMiddleware, 
    validate(vendaSchema),
    VendaController.create
);


// RELATÓRIOS
routes.get(
    "/relatorios",
    authMiddleware,
    authorize(['ADMINISTRADOR', 'SUPERADMINISTRADOR']),
    ReportController.loadReports
);

export default routes;