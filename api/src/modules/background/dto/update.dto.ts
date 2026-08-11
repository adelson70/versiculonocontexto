import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';

export class UpdateBackgroundDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do contexto histórico' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o ID do contexto histórico' })
  id: string;

  @ApiProperty({
    example: 'Texto do contexto histórico',
    description: 'Texto do contexto histórico',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsObrigatorio({ message: 'Informe o texto do contexto histórico' })
  context: string;
}
