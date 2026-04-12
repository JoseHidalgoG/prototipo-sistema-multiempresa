import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSucursalDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() direccion: string;
  @IsString() @IsNotEmpty() telefono: string;
  @IsString() @IsNotEmpty() idEmpresa: string;
}

export class UpdateSucursalDto {
  @IsString() @IsOptional() nombre?: string;
  @IsString() @IsOptional() direccion?: string;
  @IsString() @IsOptional() telefono?: string;
}
