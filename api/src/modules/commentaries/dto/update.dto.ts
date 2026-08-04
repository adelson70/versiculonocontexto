import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';

export class UpdateCommentaryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do comentário' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o ID do comentário' })
  id: string;

  @ApiProperty({
    example: 'Texto do comentário',
    description: 'Texto do comentário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsObrigatorio({ message: 'Informe o texto do comentário' })
  text: string;
}
