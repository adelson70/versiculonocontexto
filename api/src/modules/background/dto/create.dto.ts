import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';
import { BOOK_SLUGS, type Slugs } from '../../../common/types/books.types.js';

export class CreateBackgroundDto {
  @ApiProperty({ example: 'gn', description: 'Slug do livro' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o slug do livro' })
  @IsIn(BOOK_SLUGS, { message: 'Slug do livro inválido' })
  slug_book: Slugs;

  @ApiProperty({ example: '1', description: 'Número do capítulo' })
  @IsObrigatorio({ message: 'Informe o número do capítulo' })
  @IsNumber({}, { message: 'Número do capítulo inválido' })
  number_chapter: number;

  @ApiProperty({example: 'Texto do contexto histórico', description: 'Texto do contexto histórico'})
  @IsString()
  @IsObrigatorio({ message: 'Informe o texto do contexto histórico' })
  context: string;
}
