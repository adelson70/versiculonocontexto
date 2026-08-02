import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './user.service.js';
import { CreateUserDto } from './dto/create.dto.js';
import { UpdateUserDto } from './dto/update.dto.js';
import { Roles } from '../../common/decorator/roles.decorator.js';
import type { AuthUser } from '../../infra/auth/auth.guard.js';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // @Get()
  // @ApiOperation({ summary: 'Lista os usuários' })
  // async listar() {
  //   return this.usuario.listar();
  // }

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() dto: CreateUserDto
  ) {
    return this.users.create(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Edita um usuário (nome, senha e/ou nível)' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Body() dto: UpdateUserDto
  ) {
    return this.users.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um usuário' })
  async delete(
    @Param('id') id: string
  ) {
    return this.users.delete(id);
  }
}
