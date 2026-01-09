import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Venda } from "./Venda.js";

@Entity("venda_itens")
export class VendaItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    nomeProduto!: string;

    @Column({ type: "int" })
    quantidade!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precoVenda!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precoCusto!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalLucro!: number;

    @ManyToOne(() => Venda, (venda) => venda.items)
    venda!: Venda;
}