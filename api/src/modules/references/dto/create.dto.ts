import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';
import { BOOK_SLUGS, type Slugs } from '../../../common/types/books.types.js';

export class CreateReferenceDto {
  @ApiProperty({ example: 'gn', description: 'Slug do livro de origem' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o slug do livro de origem' })
  @IsIn(BOOK_SLUGS, { message: 'Slug do livro de origem inválido' })
  slug_book_from: Slugs;

  @ApiProperty({ example: '1', description: 'Número do capítulo de origem' })
  @IsObrigatorio({ message: 'Informe o número do capítulo de origem' })
  @IsNumber({}, { message: 'Número do capítulo de origem inválido' })
  number_chapter_from: number;

  @ApiProperty({ example: '1', description: 'Número do versículo de origem' })
  @IsObrigatorio({ message: 'Informe o número do versículo de origem' })
  @IsNumber({}, { message: 'Número do versículo de origem inválido' })
  number_verse_from: number;

  @ApiProperty({ example: 'ap', description: 'Slug do livro de destino' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o slug do livro de destino' })
  @IsIn(BOOK_SLUGS, { message: 'Slug do livro de destino inválido' })
  slug_book_to: Slugs;

  @ApiProperty({ example: '1', description: 'Número do capítulo de destino' })
  @IsObrigatorio({ message: 'Informe o número do capítulo de destino' })
  @IsNumber({}, { message: 'Número do capítulo de destino inválido' })
  number_chapter_to: number;

  @ApiProperty({ example: '1', description: 'Número do versículo de destino' })
  @IsObrigatorio({ message: 'Informe o número do versículo de destino' })
  @IsNumber({}, { message: 'Número do versículo de destino inválido' })
  number_verse_to: number;

}
