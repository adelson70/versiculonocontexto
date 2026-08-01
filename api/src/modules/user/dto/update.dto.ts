import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { Role } from '../../../../generated/prisma/enums.js';

export class UpdateUserDto {
  @ApiProperty({
    example: 'joao',
    description: 'Nome ou login do usuário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  nome?: string;

  @ApiProperty({
    example: 'senha1234',
    description: 'Nova senha de acesso',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
  senha?: string;

  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    description: 'Nível de acesso do usuário',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Nível de acesso inválido' })
  role?: Role;
}
