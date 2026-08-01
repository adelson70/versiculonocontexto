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

  // @Post()
  // @ApiOperation({ summary: 'Cria um usuário' })
  // @ApiBody({ type: CriarUsuarioDto })
  // async criar(@Body() dto: CriarUsuarioDto) {
  //   return this.usuario.criar(dto);
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Edita um usuário (nome, senha e/ou nível)' })
  // @ApiBody({ type: EditarUsuarioDto })
  // async editar(@Param('id') id: string, @Body() dto: EditarUsuarioDto) {
  //   return this.usuario.editar(id, dto);
  // }

  // @Post(':id/logout')
  // @ApiOperation({ summary: 'Força o logout de um usuário (via socket)' })
  // async forcarLogout(@Param('id') id: string) {
  //   return this.usuario.forcarLogout(id);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Exclui um usuário' })
  // async deletar(@Param('id') id: string, @Req() req: { user: AuthUser }) {
  //   return this.usuario.deletar(id, req.user.id);
  // }
}
