import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './sucursal.entity';
import { CreateSucursalDto, UpdateSucursalDto } from './sucursal.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SucursalService {
  constructor(@InjectRepository(Sucursal) private readonly repo: Repository<Sucursal>) {}

  async findAll(idEmpresa?: string): Promise<Sucursal[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, relations: ['empresa'], order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Sucursal> {
    const item = await this.repo.findOne({ where: { idSucursal: id }, relations: ['empresa'] });
    if (!item) throw new NotFoundException(`Sucursal ${id} no encontrada`);
    return item;
  }

  async create(dto: CreateSucursalDto): Promise<Sucursal> {
    const item = this.repo.create({ idSucursal: uuid(), ...dto });
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateSucursalDto): Promise<Sucursal> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
