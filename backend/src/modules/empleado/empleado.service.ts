import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './empleado.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EmpleadoService {
  constructor(@InjectRepository(Empleado) private readonly repo: Repository<Empleado>) {}

  async findAll(idEmpresa?: string): Promise<Empleado[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Empleado> {
    const item = await this.repo.findOne({ where: { idEmpleado: id } });
    if (!item) throw new NotFoundException(`Empleado ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateEmpleadoDto): Promise<Empleado> {
    return this.repo.save(this.repo.create({ idEmpleado: uuid(), ...dto }));
  }

  async update(id: string, dto: UpdateEmpleadoDto): Promise<Empleado> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
