import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Stock } from '../stock/stock.entity';

@Entity('producto')
export class Producto {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idProducto: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  tipo: string;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'float' })
  precioVenta: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  idCategoria: string;

  @ManyToOne(() => Empresa, (e) => e.productos)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;

  @ManyToOne(() => Categoria, (c) => c.productos, { nullable: true })
  @JoinColumn({ name: 'idCategoria' })
  categoriaRel: Categoria;

  @OneToMany(() => Stock, (s) => s.producto)
  stocks: Stock[];
}
