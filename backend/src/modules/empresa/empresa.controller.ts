import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './empresa.dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly service: EmpresaService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Get(':id/stats')
  getStats(@Param('id') id: string) { return this.service.getStats(id); }

  @Post()
  create(@Body() dto: CreateEmpresaDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmpresaDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
