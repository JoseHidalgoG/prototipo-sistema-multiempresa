import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Empresa } from '../empresa/empresa.entity';
import { Sucursal } from '../sucursal/sucursal.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Producto } from '../producto/producto.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Empleado } from '../empleado/empleado.entity';
import { Stock } from '../stock/stock.entity';
import { Venta } from '../venta/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Empresa, Sucursal, Categoria, Producto,
      Proveedor, Cliente, Empleado, Stock, Venta,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
