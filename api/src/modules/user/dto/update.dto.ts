import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { Role } from '../../../../generated/prisma/enums.js';
import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';

export class UpdateUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do usuário' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o ID do usuário' })
  id: string;

  @ApiProperty({
    example: 'joao',
    description: 'Nome ou login do usuário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name?: string;

  @ApiProperty({
    example: 'joao@gmail.com',
    description: 'Email do usuário',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'senha1234',
    description: 'Nova senha de acesso',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
  password?: string;

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
