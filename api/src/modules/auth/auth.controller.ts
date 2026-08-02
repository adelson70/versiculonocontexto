import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { Public } from '../../common/decorator/public.decorator.js';
import { LoginDto } from './dto/create.dto.js';
import { UpdateUserDto } from './dto/update.dto.js';
import type { AuthUser } from '../../infra/auth/auth.guard.js';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response
  ) {
    const data = await this.auth.login(dto);
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data,
    });
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Realiza o logout do usuário' })
  logout(
    @Res() res: Response
  ) {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
      data: null,
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  async me(
    @Req() req: { user: AuthUser }
  ) {
    return this.auth.me(req.user.id);
  }
}
