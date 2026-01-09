import "reflect-metadata";
import { DataSource } from "typeorm";
import { Aluguel } from "../entities/Aluguel.js";
import { Usuario } from "../entities/Usuario.js";
import { Produto } from "../entities/Produto.js";
import { Venda } from "../entities/Venda.js";
import { VendaItem } from "../entities/VendaItem.js";
import { Restaurante } from "../entities/Restaurante.js";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: true,
    entities: [Usuario, Aluguel, Produto, Venda, VendaItem, Restaurante],
    migrations: [],
    subscribers: [],
});