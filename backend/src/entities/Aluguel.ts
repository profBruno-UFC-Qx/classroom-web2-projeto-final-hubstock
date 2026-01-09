import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("alugueis")
export class Aluguel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    clienteNome!: string;

    @Column({ type: "varchar" })
    clienteTelefone!: string;

    @Column({ type: "int" })
    produtoId!: number;

    @Column({ type: "varchar" })
    produtoNome!: string;

    @Column({ type: "int" })
    quantidade!: number;

    @Column({ type: "varchar", nullable: true })
    produtoFotoUrl!: string;

    @Column({ type: "int" })
    limiteHoras!: number;

    @Column({ type: "varchar", default: 'ATIVO' }) // ATIVO ou FINALIZADO
    status!: string;

    @CreateDateColumn()
    dataInicio!: Date;

    @Column({ type: "datetime", nullable: true })
    dataFim?: Date;
}