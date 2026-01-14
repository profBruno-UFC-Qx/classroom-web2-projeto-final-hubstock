import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Restaurante } from "./Restaurante.js";
import { UsuarioPapel } from "../types/index.js";

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    nome!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar", select: false })
    senha!: string;

    @Column({ type: "varchar", default: UsuarioPapel.GARCOM })
    role!: UsuarioPapel;

    @Column({ type: "varchar", nullable: true })
    restauranteId!: string;

    // Muitos usuários pertencem a um restaurante
    @ManyToOne(() => Restaurante, (restaurante) => restaurante.usuarios)
    @JoinColumn({ name: "restauranteId" })
    restaurante!: Restaurante;

    @CreateDateColumn()
    dataCriacao!: Date;
}