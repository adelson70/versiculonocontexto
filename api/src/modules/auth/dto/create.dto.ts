import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'O nome ou login do usuário',
    example: 'admin@versiculocontexto.com.br',
    minLength: 3,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'A senha de acesso do usuário',
    example: 'teste',
    minLength: 4,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
  password: string;
}
