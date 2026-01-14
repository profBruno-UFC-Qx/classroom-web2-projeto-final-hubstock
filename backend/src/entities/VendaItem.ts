import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venda } from "./Venda.js";

@Entity("venda_itens")
export class VendaItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

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

    @Column({ type: "varchar" })
    vendaId!: string;

    @Column({ type: "varchar" })
    produtoId!: string;

    @ManyToOne(() => Venda, (venda) => venda.items)
    @JoinColumn({ name: "vendaId" })
    venda!: Venda;
}