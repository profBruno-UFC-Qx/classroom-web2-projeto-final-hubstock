import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { VendaItem } from "./VendaItem.js";
import { Mesa } from "./Mesa.js";

@Entity("vendas")
export class Venda {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn()
    data!: Date;

    @Column({ type: "varchar" })
    usuarioId!: string;

    @Column({ type: "varchar" })
    nomeUsuario!: string;

    @Column({ type: "varchar" })
    restauranteId!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalValor!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalCusto!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalLucro!: number;

    @OneToMany(() => VendaItem, (item) => item.venda, { cascade: true })
    items!: VendaItem[];

    @Column({ type: "varchar", nullable: true })
    mesaId!: string;

    @ManyToOne(() => Mesa)
    @JoinColumn({ name: "mesaId" })
    mesa!: Mesa;

    @CreateDateColumn()
    dataCriacao!: Date;
}