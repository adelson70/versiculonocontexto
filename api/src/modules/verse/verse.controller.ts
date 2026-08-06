import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { VerseService } from './verse.service.js';
import { FindVerseDto } from './dto/find.dto.js';
import { Public } from '../../common/decorator/public.decorator.js';

@ApiTags('Verses')
@Public()
@Controller('verses')
export class VerseController {
  constructor(private readonly verse: VerseService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os versículos' })
  async list(
    @Query('book') book: string,
    @Query('number_chapter') number_chapter: number,
  ) {
    return this.verse.list(book, number_chapter);
  }

  @Get('/details/:verse_id')
  @ApiOperation({ summary: 'Detalhes do versículo' })
  async details(
    @Param('verse_id') verse_id: string
  ) {
    return this.verse.details(verse_id);
  }

}
