import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';
import { Empleado } from '../empleado/empleado.entity';

@Entity('venta')
export class Venta {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idVenta: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ncf: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  idCliente: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  idEmpleado: string;

  @Column({ type: 'varchar', length: 50 })
  tipoDePago: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'float', default: 0 })
  descuentoTotal: number;

  @Column({ type: 'float', default: 0 })
  itbisTotal: number;

  @Column({ type: 'float', default: 0 })
  montoTotal: number;

  @Column({ type: 'varchar', length: 30, default: 'completada' })
  estado: string;

  @Column({ type: 'float', default: 0 })
  montoDescuento: number;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'idCliente' })
  cliente: Cliente;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'idEmpleado' })
  empleado: Empleado;
}
