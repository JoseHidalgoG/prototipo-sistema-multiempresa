import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateCategoriaDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
