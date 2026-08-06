import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';

export class FindVerseDto {
  @ApiProperty({ example: 'gn', description: 'Slug ou nome completo do livro (case insensitive)' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o slug ou nome do livro' })
  book: string;

  @ApiProperty({ example: '1', description: 'Número do capítulo' })
  @IsObrigatorio({ message: 'Informe o número do capítulo' })
  @IsNumber({}, { message: 'Número do capítulo inválido' })
  number_chapter: number;

}
