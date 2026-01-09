import { AppDataSource } from "../database/data-source.js";
import { Usuario } from "../entities/Usuario.js";
import { Restaurante } from "../entities/Restaurante.js";
import { Produto } from "../entities/Produto.js";
import bcrypt from "bcryptjs";
import { CategoriaProduto, UnidadeMedida, UsuarioPapel } from "../types/index.js";

export const runSeeder = async () => {
    const restauranteRepo = AppDataSource.getRepository(Restaurante);
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const produtoRepo = AppDataSource.getRepository(Produto);

    const emailAdmin = "autentica@admin.com";

    // Cria Restaurante de Exemplo
    let restaurante = await restauranteRepo.findOneBy({ cnpjRestaurante: "12.345.678/0001-90" });
    
    if (!restaurante) {
        console.log("🌱 Criando restaurante de teste...");
        restaurante = restauranteRepo.create({
            nomeRestaurante: "Autêntica - Comida Caseira",
            cnpjRestaurante: "12.345.678/0001-90",
            urlImagemPerfilRestaurante: "https://i.imgur.com/X0eeM1r.png"
        });
        await restauranteRepo.save(restaurante);
    }

    // Cria SuperAdmin
    const temSuper = await usuarioRepo.findOneBy({ email: "savio@superadmin.com" });
    if (!temSuper) {
        console.log("Criando SuperAdmin...");
        const superAdmin = usuarioRepo.create({
            nome: "Sávio SuperAdmin",
            email: "savio@superadmin.com",
            senha: await bcrypt.hash("25052022", 10),
            role: UsuarioPapel.SUPERADMINISTRADOR
        });
        await usuarioRepo.save(superAdmin);
    }

    // 3. Criar Admin do Restaurante
    const temAdmin = await usuarioRepo.findOneBy({ email: "admin@restaurante.com" });
    if (!temAdmin) {
        console.log("Criando Admin do restaurante...");
        const adminLocal = usuarioRepo.create({
            nome: "Gerente Matriz",
            email: emailAdmin,
            senha: await bcrypt.hash("25052022", 10),
            role: UsuarioPapel.ADMINISTRADOR,
            restauranteId: restaurante.id
        });
        await usuarioRepo.save(adminLocal);
    }

    // 4. Criar Produtos de Teste
    const totalProdutos = await produtoRepo.count();
    if (totalProdutos === 0) {
        console.log("🌱 Criando produtos iniciais...");
        await produtoRepo.save([
            {
                nomeProduto: "Coca-Cola 350ml",
                descricao: "Refrigerante Coca-Cola Lata 350ml",
                unidadeMedidaProduto: UnidadeMedida.UNIDADE,
                categoriaProduto: CategoriaProduto.BEBIDAS,
                precoCustoProduto: 2.5,
                precoVendaProduto: 6,
                urlImagemProduto: "https://example.com/images/coca-cola-350ml.png",
                estoqueAtual: 50,
                isLocacao: false,
            },
            {
                nomeProduto: "Raquete Beach Tenis",
                descricao: "Raquete profissional para Beach Tennis",
                categoriaProduto: CategoriaProduto.ESPORTES,
                unidadeMedidaProduto: UnidadeMedida.UNIDADE,
                precoCustoProduto: 150,
                precoVendaProduto: 350,
                urlImagemProduto: "https://i.imgur.com/KbRZNJa.png",
                estoqueAtual: 10,
                isLocacao: true,
            }
        ]);
    }

    console.log("Seed finalizado!");
};