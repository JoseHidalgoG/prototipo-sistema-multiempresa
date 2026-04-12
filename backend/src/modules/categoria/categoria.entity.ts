import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Producto } from '../producto/producto.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idCategoria: string;

  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @Column({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @ManyToOne(() => Empresa, (e) => e.categorias)
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;

  @OneToMany(() => Producto, (p) => p.categoriaRel)
  productos: Producto[];
}
