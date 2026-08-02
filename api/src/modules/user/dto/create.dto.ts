import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { Role } from '../../../../generated/prisma/enums.js';
import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';

export class CreateUserDto {
  @ApiProperty({ example: 'joao', description: 'Nome ou login do usuário' })
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @IsObrigatorio({ message: 'Informe o nome do usuário' })
  name: string;

  @ApiProperty({ example: 'joao@gmail.com', description: 'Email do usuário' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'senha1234', description: 'Senha de acesso' })
  @IsString()
  @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
  @IsObrigatorio({ message: 'Informe a senha do usuário' })
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    description: 'Nível de acesso do usuário',
  })
  @IsEnum(Role, { message: 'Nível de acesso inválido' })
  role: Role;
}
