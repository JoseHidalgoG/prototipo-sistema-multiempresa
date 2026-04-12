import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto, UpdateStockDto } from './stock.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StockService {
  constructor(@InjectRepository(Stock) private readonly repo: Repository<Stock>) {}

  async findAll(idSucursal?: string): Promise<Stock[]> {
    const where = idSucursal ? { idSucursal } : {};
    return this.repo.find({ where, relations: ['sucursal', 'producto'], order: { idStock: 'ASC' } });
  }

  async findByProducto(idProducto: string): Promise<Stock[]> {
    return this.repo.find({ where: { idProducto }, relations: ['sucursal', 'producto'] });
  }

  async findOne(id: string): Promise<Stock> {
    const item = await this.repo.findOne({ where: { idStock: id }, relations: ['sucursal', 'producto'] });
    if (!item) throw new NotFoundException(`Stock ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateStockDto): Promise<Stock> {
    const existing = await this.repo.findOne({
      where: { idSucursal: dto.idSucursal, idProducto: dto.idProducto },
    });
    if (existing) throw new BadRequestException('Ya existe un registro de stock para este producto en esta sucursal');
    return this.repo.save(this.repo.create({ idStock: uuid(), cantidadMinima: 5, ...dto }));
  }

  async update(id: string, dto: UpdateStockDto): Promise<Stock> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async aumentarStock(id: string, cantidad: number): Promise<Stock> {
    const stock = await this.findOne(id);
    stock.cantidadDisponible += cantidad;
    return this.repo.save(stock);
  }

  async reducirStock(id: string, cantidad: number): Promise<Stock> {
    const stock = await this.findOne(id);
    if (stock.cantidadDisponible < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    stock.cantidadDisponible -= cantidad;
    return this.repo.save(stock);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getLowStock(): Promise<Stock[]> {
    const all = await this.repo.find({ relations: ['sucursal', 'producto'] });
    return all.filter((s) => s.cantidadDisponible <= s.cantidadMinima);
  }
}
