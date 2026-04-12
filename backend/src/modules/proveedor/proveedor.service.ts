import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto, UpdateProveedorDto } from './proveedor.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProveedorService {
  constructor(@InjectRepository(Proveedor) private readonly repo: Repository<Proveedor>) {}

  async findAll(idEmpresa?: string): Promise<Proveedor[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Proveedor> {
    const item = await this.repo.findOne({ where: { idProveedor: id } });
    if (!item) throw new NotFoundException(`Proveedor ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateProveedorDto): Promise<Proveedor> {
    return this.repo.save(this.repo.create({ idProveedor: uuid(), ...dto }));
  }

  async update(id: string, dto: UpdateProveedorDto): Promise<Proveedor> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
