import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto, UpdateProveedorDto } from './proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly service: ProveedorService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateProveedorDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProveedorDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
