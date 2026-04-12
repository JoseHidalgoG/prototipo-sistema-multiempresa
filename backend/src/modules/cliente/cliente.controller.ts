import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto, UpdateClienteDto } from './cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateClienteDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
