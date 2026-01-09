import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { VendaItem } from "./VendaItem.js";

@Entity("vendas")
export class Venda {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    data!: Date;

    @Column({ type: "int" })
    usuarioId!: number;

    @Column({ type: "varchar" })
    nomeUsuario!: string;

    @Column({ type: "int" })
    restauranteId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalValor!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalCusto!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalLucro!: number;

    @OneToMany(() => VendaItem, (item) => item.venda, { cascade: true })
    items!: VendaItem[];
}