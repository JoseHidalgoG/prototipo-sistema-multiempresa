import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from './stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  findAll(@Query('idSucursal') idSucursal?: string) { return this.service.findAll(idSucursal); }

  @Get('low')
  getLowStock() { return this.service.getLowStock(); }

  @Get('producto/:idProducto')
  findByProducto(@Param('idProducto') idProducto: string) { return this.service.findByProducto(idProducto); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateStockDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockDto) { return this.service.update(id, dto); }

  @Patch(':id/aumentar')
  aumentar(@Param('id') id: string, @Body('cantidad') cantidad: number) { return this.service.aumentarStock(id, cantidad); }

  @Patch(':id/reducir')
  reducir(@Param('id') id: string, @Body('cantidad') cantidad: number) { return this.service.reducirStock(id, cantidad); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
