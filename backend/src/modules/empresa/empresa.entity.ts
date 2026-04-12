import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Sucursal } from '../sucursal/sucursal.entity';
import { Producto } from '../producto/producto.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Empleado } from '../empleado/empleado.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  idEmpresa: string;

  @Column({ type: 'varchar', length: 20 })
  rnc: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @OneToMany(() => Sucursal, (s) => s.empresa)
  sucursales: Sucursal[];

  @OneToMany(() => Producto, (p) => p.empresa)
  productos: Producto[];

  @OneToMany(() => Categoria, (c) => c.empresa)
  categorias: Categoria[];

  @OneToMany(() => Proveedor, (p) => p.empresa)
  proveedores: Proveedor[];

  @OneToMany(() => Cliente, (c) => c.empresa)
  clientes: Cliente[];

  @OneToMany(() => Empleado, (e) => e.empresa)
  empleados: Empleado[];
}
