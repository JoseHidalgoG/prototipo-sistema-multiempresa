import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';

@Injectable()
export class VentaService {
  constructor(@InjectRepository(Venta) private readonly repo: Repository<Venta>) {}

  async findAll(idEmpresa?: string): Promise<Venta[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, relations: ['cliente', 'empleado'], order: { fecha: 'DESC' } });
  }

  async findOne(id: string): Promise<Venta> {
    return this.repo.findOne({ where: { idVenta: id }, relations: ['cliente', 'empleado'] });
  }

  async getResumen(idEmpresa: string) {
    const ventas = await this.repo.find({ where: { idEmpresa } });
    const total = ventas.reduce((sum, v) => sum + v.montoTotal, 0);
    return {
      totalVentas: ventas.length,
      montoTotal: Math.round(total * 100) / 100,
      ventasCompletadas: ventas.filter((v) => v.estado === 'completada').length,
    };
  }
}
