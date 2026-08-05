import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReferencesService } from './references.service.js';
import { CreateReferenceDto } from './dto/create.dto.js';
import { UpdateReferenceDto } from './dto/update.dto.js';
import type { AuthUser } from '../../infra/auth/auth.guard.js';

@ApiTags('References')
@ApiBearerAuth()
@Controller('references')
export class ReferencesController {
  constructor(private readonly references: ReferencesService) {}

  // @Get()
  // @ApiOperation({ summary: 'Lista os usuários' })
  // async listar() {
  //   return this.usuario.listar();
  // }

  @Post()
  @ApiOperation({ summary: 'Cria uma referência' })
  @ApiBody({ type: CreateReferenceDto })
  async create(
    @Body() dto: CreateReferenceDto,
    @Req() req: { user: AuthUser }
  ) {
    return this.references.create(dto, req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Edita uma referência' })
  @ApiBody({ type: UpdateReferenceDto })
  async update(
    @Body() dto: UpdateReferenceDto
  ) {
    return this.references.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma referência' })
  async delete(
    @Param('id') id: string
  ) {
    return this.references.delete(id);
  }
}
