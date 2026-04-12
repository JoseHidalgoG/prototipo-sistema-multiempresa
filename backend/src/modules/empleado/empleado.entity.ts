import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('empleado')
export class Empleado {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idEmpleado: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo: string;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Empresa, (e) => e.empleados)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}
