import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateStockDto {
  @IsString() @IsNotEmpty() idSucursal: string;
  @IsString() @IsNotEmpty() idProducto: string;
  @IsNumber() @Min(0) cantidadDisponible: number;
  @IsNumber() @IsOptional() @Min(0) cantidadMinima?: number;
}

export class UpdateStockDto {
  @IsNumber() @IsOptional() @Min(0) cantidadDisponible?: number;
  @IsNumber() @IsOptional() @Min(0) cantidadMinima?: number;
}
