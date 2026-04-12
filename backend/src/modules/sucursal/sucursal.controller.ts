import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto, UpdateSucursalDto } from './sucursal.dto';

@Controller('sucursales')
export class SucursalController {
  constructor(private readonly service: SucursalService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateSucursalDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSucursalDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
