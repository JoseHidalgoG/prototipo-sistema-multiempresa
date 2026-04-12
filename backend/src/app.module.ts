import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { SucursalModule } from './modules/sucursal/sucursal.module';
import { ProductoModule } from './modules/producto/producto.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ProveedorModule } from './modules/proveedor/proveedor.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { EmpleadoModule } from './modules/empleado/empleado.module';
import { StockModule } from './modules/stock/stock.module';
import { VentaModule } from './modules/venta/venta.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'multiempresa.db',
      autoLoadEntities: true,
      synchronize: true, // Solo para prototipo/demo
    }),
    EmpresaModule,
    SucursalModule,
    ProductoModule,
    CategoriaModule,
    ProveedorModule,
    ClienteModule,
    EmpleadoModule,
    StockModule,
    VentaModule,
    SeedModule,
  ],
})
export class AppModule {}
