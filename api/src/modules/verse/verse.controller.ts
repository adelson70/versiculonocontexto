import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { VerseService } from './verse.service.js';
import { Public } from '../../common/decorator/public.decorator.js';
import { getClientBrowser } from '../../common/utils/get-client-browser.js';
import { getClientIp } from '../../common/utils/get-client-ip.js';

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
    @Req() req: Request
  ) {
    const browser = getClientBrowser(req);
    const ip = getClientIp(req);

    return this.verse.list(book, number_chapter, ip, browser);
  }

  @Get('/details/:verse_id')
  @ApiOperation({ summary: 'Detalhes do versículo' })
  async details(
    @Param('verse_id') verse_id: string
  ) {
    return this.verse.details(verse_id);
  }

}
