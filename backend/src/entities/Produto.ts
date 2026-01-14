import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CategoriaProduto, UnidadeMedida } from "../types/index.js";

@Entity("produtos")
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    nomeProduto!: string;

    @Column({ type: "text", nullable: true })
    descricao!: string;

    @Column({ type: "varchar", default: UnidadeMedida.UNIDADE })
    unidadeMedidaProduto!: UnidadeMedida;

    @Column({ type: "varchar", default: CategoriaProduto.OUTROS })
    categoriaProduto!: CategoriaProduto;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precoCustoProduto!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precoVendaProduto!: number;

    @Column({ type: "varchar", nullable: true })
    urlImagemProduto!: string;

    @Column({ type: "int", default: 0 })
    estoqueAtual!: number;

    @Column({ type: "varchar" })
    restauranteId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}