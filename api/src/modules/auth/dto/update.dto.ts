import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'O nome ou login do usuário',
    example: 'admin',
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  nome?: string;

  @ApiProperty({
    description: 'A nova senha de acesso do usuário',
    example: 'admin1234',
    minLength: 4,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
  senha?: string;
}
