import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './cliente.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ClienteService {
  constructor(@InjectRepository(Cliente) private readonly repo: Repository<Cliente>) {}

  async findAll(idEmpresa?: string): Promise<Cliente[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Cliente> {
    const item = await this.repo.findOne({ where: { idCliente: id } });
    if (!item) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    return this.repo.save(this.repo.create({ idCliente: uuid(), ...dto }));
  }

  async update(id: string, dto: UpdateClienteDto): Promise<Cliente> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
