import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateClienteDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() apellido: string;
  @IsString() @IsOptional() cedula?: string;
  @IsString() @IsOptional() telefono?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() direccion?: string;
  @IsNumber() @IsOptional() @Min(0) limiteCredito?: number;
  @IsString() @IsNotEmpty() idEmpresa: string;
}

export class UpdateClienteDto {
  @IsString() @IsOptional() nombre?: string;
  @IsString() @IsOptional() apellido?: string;
  @IsString() @IsOptional() cedula?: string;
  @IsString() @IsOptional() telefono?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() direccion?: string;
  @IsNumber() @IsOptional() @Min(0) limiteCredito?: number;
}
