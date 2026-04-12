import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './categoria.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CategoriaService {
  constructor(@InjectRepository(Categoria) private readonly repo: Repository<Categoria>) {}

  async findAll(idEmpresa?: string): Promise<Categoria[]> {
    const where = idEmpresa ? { idEmpresa } : {};
    return this.repo.find({ where, order: { categoria: 'ASC' } });
  }

  async findOne(id: string): Promise<Categoria> {
    const item = await this.repo.findOne({ where: { idCategoria: id } });
    if (!item) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return item;
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    return this.repo.save(this.repo.create({ idCategoria: uuid(), ...dto }));
  }

  async update(id: string, dto: UpdateCategoriaDto): Promise<Categoria> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
