import { Body, Controller, Delete, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BackgroundService } from './background.service.js';
import { CreateBackgroundDto } from './dto/create.dto.js';
import { UpdateBackgroundDto } from './dto/update.dto.js';
import type { AuthUser } from '../../infra/auth/auth.guard.js';

@ApiTags('Backgrounds')
@ApiBearerAuth()
@Controller('backgrounds')
export class BackgroundController {
  constructor(private readonly background: BackgroundService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um contexto histórico' })
  @ApiBody({ type: CreateBackgroundDto })
  async create(
    @Body() dto: CreateBackgroundDto,
    @Req() req: { user: AuthUser }
  ) {
    return this.background.create(dto, req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Edita um contexto histórico' })
  @ApiBody({ type: UpdateBackgroundDto })
  async update(
    @Body() dto: UpdateBackgroundDto
  ) {
    return this.background.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um contexto histórico' })
  async delete(
    @Param('id') id: string
  ) {
    return this.background.delete(id);
  }
}
