import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

import { IsObrigatorio } from '../../../common/decorator/is-obrigatorio.decorator.js';
import { BOOK_SLUGS, type Slugs } from '../../../common/types/books.types.js';

export class UpdateReferenceDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da referência' })
  @IsString()
  @IsObrigatorio({ message: 'Informe o ID da referência' })
  id: string;

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
