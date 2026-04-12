import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProveedorDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() rnc: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() telefono?: string;
  @IsString() @IsOptional() direccion?: string;
  @IsString() @IsNotEmpty() idEmpresa: string;
}

export class UpdateProveedorDto {
  @IsString() @IsOptional() nombre?: string;
  @IsString() @IsOptional() rnc?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() telefono?: string;
  @IsString() @IsOptional() direccion?: string;
}
