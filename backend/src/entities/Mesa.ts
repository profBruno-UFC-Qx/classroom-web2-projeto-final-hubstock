import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Restaurante } from "./Restaurante.js";
import { StatusMesa } from "../types/index.js";

@Entity("mesas")
export class Mesa {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "int" })
    numero!: number;

    @Column({
        type: "simple-enum",
        enum: StatusMesa,
        default: StatusMesa.DISPONIVEL
    })
    status!: StatusMesa;

    @Column({ type: "varchar" })
    restauranteId!: string;

    @ManyToOne(() => Restaurante)
    restaurante!: Restaurante;
}