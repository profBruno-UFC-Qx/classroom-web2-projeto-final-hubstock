import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Produto } from "./Produto.js";
import type { TipoMovimentacaoEstoque } from "../types/index.js";

@Entity("movimentacoes_estoque")
export class MovimentacaoEstoque {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    tipo!: TipoMovimentacaoEstoque;

    @Column({ type: "int" })
    quantidade!: number;

    @Column({ type: "text", nullable: true })
    observacao?: string;

    @Column({ type: "uuid" })
    produtoId!: string;

    @ManyToOne(() => Produto)
    @JoinColumn({ name: "produtoId" })
    produto!: Produto;

    @Column({ type: "uuid" })
    responsavelId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}