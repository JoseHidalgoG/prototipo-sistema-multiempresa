import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  rnc: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class UpdateEmpresaDto {
  @IsString()
  @IsOptional()
  rnc?: string;

  @IsString()
  @IsOptional()
  nombre?: string;
}
