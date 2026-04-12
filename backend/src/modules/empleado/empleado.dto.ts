import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsOptional() cargo?: string;
  @IsString() @IsNotEmpty() idEmpresa: string;
}

export class UpdateEmpleadoDto {
  @IsString() @IsOptional() nombre?: string;
  @IsString() @IsOptional() cargo?: string;
}
