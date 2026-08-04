import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentariesService } from './commentaries.service.js';
import { CreateCommentaryDto } from './dto/create.dto.js';
import { UpdateCommentaryDto } from './dto/update.dto.js';
import type { AuthUser } from '../../infra/auth/auth.guard.js';
import { UpdateUserDto } from '../user/dto/update.dto.js';

@ApiTags('Commentaries')
@ApiBearerAuth()
@Controller('commentaries')
export class CommentariesController {
  constructor(private readonly commentaries: CommentariesService) {}

  // @Get()
  // @ApiOperation({ summary: 'Lista os usuários' })
  // async listar() {
  //   return this.usuario.listar();
  // }

  @Post()
  @ApiOperation({ summary: 'Cria um comentário' })
  @ApiBody({ type: CreateCommentaryDto })
  async create(
    @Body() dto: CreateCommentaryDto,
    @Req() req: { user: AuthUser }
  ) {
    return this.commentaries.create(dto, req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Edita um comentário' })
  @ApiBody({ type: UpdateCommentaryDto })
  async update(
    @Body() dto: UpdateCommentaryDto
  ) {
    return this.commentaries.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um comentário' })
  async delete(
    @Param('id') id: string
  ) {
    return this.commentaries.delete(id);
  }
}
