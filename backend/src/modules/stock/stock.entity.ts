import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursal } from '../sucursal/sucursal.entity';
import { Producto } from '../producto/producto.entity';

@Entity('stock')
export class Stock {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idStock: string;

  @Column({ type: 'varchar', length: 36 })
  idSucursal: string;

  @Column({ type: 'varchar', length: 36 })
  idProducto: string;

  @Column({ type: 'int', default: 0 })
  cantidadDisponible: number;

  @Column({ type: 'int', default: 5 })
  cantidadMinima: number;

  @ManyToOne(() => Sucursal, (s) => s.stocks)
  @JoinColumn({ name: 'idSucursal' })
  sucursal: Sucursal;

  @ManyToOne(() => Producto, (p) => p.stocks)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  verificarStockMinimo(): boolean {
    return this.cantidadDisponible <= this.cantidadMinima;
  }
}
