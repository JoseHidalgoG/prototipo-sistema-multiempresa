import { Controller, Get, Param, Query } from '@nestjs/common';
import { VentaService } from './venta.service';

@Controller('ventas')
export class VentaController {
  constructor(private readonly service: VentaService) {}

  @Get()
  findAll(@Query('idEmpresa') idEmpresa?: string) { return this.service.findAll(idEmpresa); }

  @Get('resumen/:idEmpresa')
  getResumen(@Param('idEmpresa') idEmpresa: string) { return this.service.getResumen(idEmpresa); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }
}
