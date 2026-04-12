import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('cliente')
export class Cliente {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idCliente: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedula: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  direccion: string;

  @Column({ type: 'float', default: 0 })
  limiteCredito: number;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Empresa, (e) => e.clientes)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}
