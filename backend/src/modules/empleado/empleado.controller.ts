import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './empleado.dto';

@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly service: EmpleadoService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateEmpleadoDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmpleadoDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
