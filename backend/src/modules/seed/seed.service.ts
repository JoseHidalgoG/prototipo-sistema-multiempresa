import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Sucursal } from '../sucursal/sucursal.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Producto } from '../producto/producto.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Empleado } from '../empleado/empleado.entity';
import { Stock } from '../stock/stock.entity';
import { Venta } from '../venta/venta.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(Sucursal) private sucursalRepo: Repository<Sucursal>,
    @InjectRepository(Categoria) private categoriaRepo: Repository<Categoria>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(Proveedor) private proveedorRepo: Repository<Proveedor>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Empleado) private empleadoRepo: Repository<Empleado>,
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    @InjectRepository(Venta) private ventaRepo: Repository<Venta>,
  ) {}

  async onModuleInit() {
    const count = await this.empresaRepo.count();
    if (count > 0) {
      this.logger.log('Base de datos ya contiene datos. Seed omitido.');
      return;
    }
    this.logger.log('Ejecutando seed de datos de demostración...');
    await this.seed();
    this.logger.log('Seed completado exitosamente.');
  }

  private async seed() {
    // ── EMPRESAS ──
    const emp1 = await this.empresaRepo.save(
      this.empresaRepo.create({ idEmpresa: 'emp-001', rnc: '130-00001-1', nombre: 'Comercial Dominicana SRL' }),
    );
    const emp2 = await this.empresaRepo.save(
      this.empresaRepo.create({ idEmpresa: 'emp-002', rnc: '131-00002-2', nombre: 'Tech Solutions SAS' }),
    );

    // ── SUCURSALES ──
    const sucursales = await this.sucursalRepo.save([
      { idSucursal: 'suc-001', nombre: 'Sede Central Santiago', direccion: 'Av. Juan Pablo Duarte #123, Santiago', telefono: '809-555-0001', idEmpresa: emp1.idEmpresa },
      { idSucursal: 'suc-002', nombre: 'Sucursal La Vega', direccion: 'Calle Padre Adolfo #45, La Vega', telefono: '809-555-0002', idEmpresa: emp1.idEmpresa },
      { idSucursal: 'suc-003', nombre: 'Sucursal Santo Domingo', direccion: 'Av. Winston Churchill #789, DN', telefono: '809-555-0003', idEmpresa: emp1.idEmpresa },
      { idSucursal: 'suc-004', nombre: 'Oficina Principal', direccion: 'Torre Empresarial, Av. Sarasota #100, DN', telefono: '809-555-0010', idEmpresa: emp2.idEmpresa },
      { idSucursal: 'suc-005', nombre: 'Centro Tecnológico Norte', direccion: 'Av. Estrella Sadhalá #200, Santiago', telefono: '809-555-0011', idEmpresa: emp2.idEmpresa },
    ]);

    // ── CATEGORÍAS ──
    const categorias = await this.categoriaRepo.save([
      { idCategoria: 'cat-001', categoria: 'Electrónica', idEmpresa: emp1.idEmpresa },
      { idCategoria: 'cat-002', categoria: 'Alimentos', idEmpresa: emp1.idEmpresa },
      { idCategoria: 'cat-003', categoria: 'Limpieza', idEmpresa: emp1.idEmpresa },
      { idCategoria: 'cat-004', categoria: 'Bebidas', idEmpresa: emp1.idEmpresa },
      { idCategoria: 'cat-005', categoria: 'Hogar', idEmpresa: emp1.idEmpresa },
      { idCategoria: 'cat-006', categoria: 'Hardware', idEmpresa: emp2.idEmpresa },
      { idCategoria: 'cat-007', categoria: 'Software', idEmpresa: emp2.idEmpresa },
      { idCategoria: 'cat-008', categoria: 'Accesorios', idEmpresa: emp2.idEmpresa },
      { idCategoria: 'cat-009', categoria: 'Redes', idEmpresa: emp2.idEmpresa },
      { idCategoria: 'cat-010', categoria: 'Servicios', idEmpresa: emp2.idEmpresa },
    ]);

    // ── PRODUCTOS Empresa 1 ──
    const productos = await this.productoRepo.save([
      { idProducto: 'prod-001', nombre: 'Televisor LED 55"', tipo: 'Electrónico', codigo: 'TV-LED-55', precioVenta: 28500.00, marca: 'Samsung', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-001' },
      { idProducto: 'prod-002', nombre: 'Arroz Premium 5lb', tipo: 'Comestible', codigo: 'ALM-ARR-5', precioVenta: 350.00, marca: 'La Garza', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-002' },
      { idProducto: 'prod-003', nombre: 'Detergente Líquido 1gal', tipo: 'Limpieza', codigo: 'LMP-DET-1G', precioVenta: 475.00, marca: 'Ace', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-003' },
      { idProducto: 'prod-004', nombre: 'Agua Mineral 1.5L (Pack 6)', tipo: 'Bebida', codigo: 'BEB-AGU-6P', precioVenta: 220.00, marca: 'Crystal', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-004' },
      { idProducto: 'prod-005', nombre: 'Ventilador de Pie 18"', tipo: 'Electrónico', codigo: 'EL-VEN-18', precioVenta: 3200.00, marca: 'Imaco', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-001' },
      { idProducto: 'prod-006', nombre: 'Aceite de Oliva 500ml', tipo: 'Comestible', codigo: 'ALM-ACE-500', precioVenta: 580.00, marca: 'Carbonell', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-002' },
      { idProducto: 'prod-007', nombre: 'Toalla de Baño Premium', tipo: 'Hogar', codigo: 'HGR-TWL-01', precioVenta: 890.00, marca: 'Cannon', activo: false, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-005' },
      { idProducto: 'prod-008', nombre: 'Café Molido Santo Domingo 1lb', tipo: 'Comestible', codigo: 'ALM-CAF-1L', precioVenta: 420.00, marca: 'Santo Domingo', activo: true, idEmpresa: emp1.idEmpresa, idCategoria: 'cat-002' },

      // PRODUCTOS Empresa 2
      { idProducto: 'prod-101', nombre: 'Laptop Empresarial 15.6"', tipo: 'Hardware', codigo: 'HW-LAP-156', precioVenta: 52000.00, marca: 'Dell', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-006' },
      { idProducto: 'prod-102', nombre: 'Monitor 27" 4K', tipo: 'Hardware', codigo: 'HW-MON-27', precioVenta: 18500.00, marca: 'LG', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-006' },
      { idProducto: 'prod-103', nombre: 'Licencia Microsoft 365 Business', tipo: 'Software', codigo: 'SW-MS365-B', precioVenta: 8900.00, marca: 'Microsoft', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-007' },
      { idProducto: 'prod-104', nombre: 'Router WiFi 6 AX3000', tipo: 'Red', codigo: 'NET-RTR-AX3', precioVenta: 6800.00, marca: 'TP-Link', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-009' },
      { idProducto: 'prod-105', nombre: 'Teclado Mecánico RGB', tipo: 'Accesorio', codigo: 'ACC-TEC-RGB', precioVenta: 4200.00, marca: 'Logitech', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-008' },
      { idProducto: 'prod-106', nombre: 'Mouse Inalámbrico Ergonómico', tipo: 'Accesorio', codigo: 'ACC-MOU-ERG', precioVenta: 2800.00, marca: 'Logitech', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-008' },
      { idProducto: 'prod-107', nombre: 'Cable UTP Cat6 300m', tipo: 'Red', codigo: 'NET-CAB-C6', precioVenta: 7500.00, marca: 'Panduit', activo: true, idEmpresa: emp2.idEmpresa, idCategoria: 'cat-009' },
    ]);

    // ── PROVEEDORES ──
    await this.proveedorRepo.save([
      { idProveedor: 'prov-001', nombre: 'Distribuidora Nacional SA', rnc: '101-00010-1', email: 'ventas@distnacional.com', telefono: '809-600-0001', direccion: 'Zona Industrial Hainamosa, SDE', idEmpresa: emp1.idEmpresa },
      { idProveedor: 'prov-002', nombre: 'Importadora El Caribe', rnc: '101-00020-2', email: 'info@importcaribe.com', telefono: '809-600-0002', direccion: 'Puerto de Haina, San Cristóbal', idEmpresa: emp1.idEmpresa },
      { idProveedor: 'prov-003', nombre: 'MegaTech Distribuciones', rnc: '131-00030-3', email: 'ventas@megatech.com.do', telefono: '809-600-0010', direccion: 'Av. Lope de Vega #50, DN', idEmpresa: emp2.idEmpresa },
      { idProveedor: 'prov-004', nombre: 'Cloud & Systems Inc', rnc: '131-00040-4', email: 'sales@cloudsys.com', telefono: '809-600-0011', direccion: 'Blue Mall, Piso 12, DN', idEmpresa: emp2.idEmpresa },
    ]);

    // ── CLIENTES ──
    await this.clienteRepo.save([
      { idCliente: 'cli-001', nombre: 'Juan', apellido: 'Pérez Martínez', cedula: '001-0000001-1', telefono: '809-700-0001', email: 'jperez@mail.com', direccion: 'Santiago de los Caballeros', limiteCredito: 50000, idEmpresa: emp1.idEmpresa },
      { idCliente: 'cli-002', nombre: 'María', apellido: 'García López', cedula: '001-0000002-2', telefono: '809-700-0002', email: 'mgarcia@mail.com', direccion: 'La Vega', limiteCredito: 30000, idEmpresa: emp1.idEmpresa },
      { idCliente: 'cli-003', nombre: 'Carlos', apellido: 'Rodríguez Díaz', cedula: '001-0000003-3', telefono: '809-700-0003', email: 'crodriguez@mail.com', direccion: 'Santo Domingo', limiteCredito: 75000, idEmpresa: emp1.idEmpresa },
      { idCliente: 'cli-004', nombre: 'Ana', apellido: 'Fernández Reyes', cedula: '001-0000004-4', telefono: '809-700-0010', email: 'afernandez@corp.com', direccion: 'Santo Domingo', limiteCredito: 200000, idEmpresa: emp2.idEmpresa },
      { idCliente: 'cli-005', nombre: 'Roberto', apellido: 'Sánchez Mella', cedula: '001-0000005-5', telefono: '809-700-0011', email: 'rsanchez@empresa.com', direccion: 'Santiago', limiteCredito: 150000, idEmpresa: emp2.idEmpresa },
    ]);

    // ── EMPLEADOS ──
    const empleados = await this.empleadoRepo.save([
      { idEmpleado: 'emp-e01', nombre: 'Pedro Almonte', cargo: 'Cajero', idEmpresa: emp1.idEmpresa },
      { idEmpleado: 'emp-e02', nombre: 'Laura Mendoza', cargo: 'Gerente de Sucursal', idEmpresa: emp1.idEmpresa },
      { idEmpleado: 'emp-e03', nombre: 'Miguel Torres', cargo: 'Vendedor', idEmpresa: emp1.idEmpresa },
      { idEmpleado: 'emp-e04', nombre: 'Sandra Núñez', cargo: 'Administradora', idEmpresa: emp1.idEmpresa },
      { idEmpleado: 'emp-e05', nombre: 'Diego Ramírez', cargo: 'Ingeniero de Ventas', idEmpresa: emp2.idEmpresa },
      { idEmpleado: 'emp-e06', nombre: 'Carolina Mejía', cargo: 'Gerente Comercial', idEmpresa: emp2.idEmpresa },
      { idEmpleado: 'emp-e07', nombre: 'Luis Castillo', cargo: 'Soporte Técnico', idEmpresa: emp2.idEmpresa },
    ]);

    // ── STOCK ──
    await this.stockRepo.save([
      // Stock Empresa 1 - Sede Central
      { idStock: 'stk-001', idSucursal: 'suc-001', idProducto: 'prod-001', cantidadDisponible: 15, cantidadMinima: 3 },
      { idStock: 'stk-002', idSucursal: 'suc-001', idProducto: 'prod-002', cantidadDisponible: 200, cantidadMinima: 50 },
      { idStock: 'stk-003', idSucursal: 'suc-001', idProducto: 'prod-003', cantidadDisponible: 80, cantidadMinima: 20 },
      { idStock: 'stk-004', idSucursal: 'suc-001', idProducto: 'prod-004', cantidadDisponible: 120, cantidadMinima: 30 },
      { idStock: 'stk-005', idSucursal: 'suc-001', idProducto: 'prod-005', cantidadDisponible: 25, cantidadMinima: 5 },
      { idStock: 'stk-006', idSucursal: 'suc-001', idProducto: 'prod-006', cantidadDisponible: 45, cantidadMinima: 10 },
      { idStock: 'stk-007', idSucursal: 'suc-001', idProducto: 'prod-008', cantidadDisponible: 150, cantidadMinima: 40 },
      // Stock Empresa 1 - La Vega
      { idStock: 'stk-010', idSucursal: 'suc-002', idProducto: 'prod-002', cantidadDisponible: 100, cantidadMinima: 30 },
      { idStock: 'stk-011', idSucursal: 'suc-002', idProducto: 'prod-003', cantidadDisponible: 2, cantidadMinima: 10 },
      { idStock: 'stk-012', idSucursal: 'suc-002', idProducto: 'prod-004', cantidadDisponible: 60, cantidadMinima: 15 },
      // Stock Empresa 2
      { idStock: 'stk-020', idSucursal: 'suc-004', idProducto: 'prod-101', cantidadDisponible: 10, cantidadMinima: 3 },
      { idStock: 'stk-021', idSucursal: 'suc-004', idProducto: 'prod-102', cantidadDisponible: 20, cantidadMinima: 5 },
      { idStock: 'stk-022', idSucursal: 'suc-004', idProducto: 'prod-103', cantidadDisponible: 50, cantidadMinima: 10 },
      { idStock: 'stk-023', idSucursal: 'suc-004', idProducto: 'prod-104', cantidadDisponible: 30, cantidadMinima: 8 },
      { idStock: 'stk-024', idSucursal: 'suc-005', idProducto: 'prod-105', cantidadDisponible: 40, cantidadMinima: 10 },
      { idStock: 'stk-025', idSucursal: 'suc-005', idProducto: 'prod-106', cantidadDisponible: 35, cantidadMinima: 10 },
      { idStock: 'stk-026', idSucursal: 'suc-005', idProducto: 'prod-107', cantidadDisponible: 8, cantidadMinima: 5 },
    ]);

    // ── VENTAS DE EJEMPLO ──
    await this.ventaRepo.save([
      { idVenta: 'vta-001', ncf: 'B0200000001', idCliente: 'cli-001', idEmpleado: 'emp-e01', tipoDePago: 'Efectivo', fecha: '2025-04-01', descuentoTotal: 0, itbisTotal: 5130, montoTotal: 33630, estado: 'completada', montoDescuento: 0, idEmpresa: emp1.idEmpresa },
      { idVenta: 'vta-002', ncf: 'B0200000002', idCliente: 'cli-002', idEmpleado: 'emp-e03', tipoDePago: 'Tarjeta', fecha: '2025-04-02', descuentoTotal: 200, itbisTotal: 140.40, montoTotal: 720.40, estado: 'completada', montoDescuento: 200, idEmpresa: emp1.idEmpresa },
      { idVenta: 'vta-003', ncf: 'B0200000003', idCliente: 'cli-003', idEmpleado: 'emp-e01', tipoDePago: 'Efectivo', fecha: '2025-04-03', descuentoTotal: 0, itbisTotal: 576, montoTotal: 3776, estado: 'completada', montoDescuento: 0, idEmpresa: emp1.idEmpresa },
      { idVenta: 'vta-004', ncf: 'E3100000001', idCliente: 'cli-004', idEmpleado: 'emp-e05', tipoDePago: 'Transferencia', fecha: '2025-04-01', descuentoTotal: 5000, itbisTotal: 9360, montoTotal: 56360, estado: 'completada', montoDescuento: 5000, idEmpresa: emp2.idEmpresa },
      { idVenta: 'vta-005', ncf: 'E3100000002', idCliente: 'cli-005', idEmpleado: 'emp-e06', tipoDePago: 'Crédito', fecha: '2025-04-05', descuentoTotal: 0, itbisTotal: 3330, montoTotal: 21830, estado: 'completada', montoDescuento: 0, idEmpresa: emp2.idEmpresa },
    ]);

    this.logger.log(`Seed: 2 empresas, ${sucursales.length} sucursales, ${categorias.length} categorías, ${productos.length} productos creados`);
  }
}
