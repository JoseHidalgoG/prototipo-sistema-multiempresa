import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Stock } from '../stock/stock.entity';

@Entity('sucursal')
export class Sucursal {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idSucursal: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 300 })
  direccion: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Empresa, (e) => e.sucursales)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;

  @OneToMany(() => Stock, (s) => s.sucursal)
  stocks: Stock[];
}
