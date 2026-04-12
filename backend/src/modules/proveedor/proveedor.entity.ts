import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('proveedor')
export class Proveedor {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idProveedor: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  rnc: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Empresa, (e) => e.proveedores)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}
