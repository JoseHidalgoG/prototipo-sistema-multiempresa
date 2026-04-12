import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { CreateEmpresaDto, UpdateEmpresaDto } from './empresa.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly repo: Repository<Empresa>,
  ) {}

  async findAll(): Promise<Empresa[]> {
    return this.repo.find({ relations: ['sucursales'] });
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.repo.findOne({
      where: { idEmpresa: id },
      relations: ['sucursales'],
    });
    if (!empresa) throw new NotFoundException(`Empresa ${id} no encontrada`);
    return empresa;
  }

  async create(dto: CreateEmpresaDto): Promise<Empresa> {
    const empresa = this.repo.create({ idEmpresa: uuid(), ...dto });
    return this.repo.save(empresa);
  }

  async update(id: string, dto: UpdateEmpresaDto): Promise<Empresa> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getStats(id: string) {
    const empresa = await this.repo.findOne({
      where: { idEmpresa: id },
      relations: ['sucursales', 'productos', 'categorias', 'proveedores', 'clientes', 'empleados'],
    });
    if (!empresa) throw new NotFoundException(`Empresa ${id} no encontrada`);
    return {
      empresa: empresa.nombre,
      sucursales: empresa.sucursales?.length || 0,
      productos: empresa.productos?.length || 0,
      categorias: empresa.categorias?.length || 0,
      proveedores: empresa.proveedores?.length || 0,
      clientes: empresa.clientes?.length || 0,
      empleados: empresa.empleados?.length || 0,
    };
  }
}
