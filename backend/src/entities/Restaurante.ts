import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./Usuario.js";

@Entity("restaurantes")
export class Restaurante {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    nomeRestaurante!: string;

    @Column({ type: "varchar", unique: true })
    cnpjRestaurante!: string;

    @Column({ type: "varchar", nullable: true })
    urlImagemPerfilRestaurante!: string;

    // Um restaurante tem vários usuários
    @OneToMany(() => Usuario, (usuario) => usuario.restaurante)
    usuarios!: Usuario[];
}