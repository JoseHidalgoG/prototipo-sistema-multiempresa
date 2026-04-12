import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString() @IsNotEmpty() categoria: string;
  @IsString() @IsNotEmpty() idEmpresa: string;
}

export class UpdateCategoriaDto {
  @IsString() @IsOptional() categoria?: string;
}
