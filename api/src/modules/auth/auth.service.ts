import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { JwtServiceCustom } from '../../infra/auth/jwt.service.js';
import { tratarErroPrisma } from '../../common/errors/prisma-error.mapper.js';
import { LoginDto } from './dto/create.dto.js';
import { UpdateUserDto } from './dto/update.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaRead: PrismaReadService,
    private readonly prismaWrite: PrismaWriteService,
    private readonly jwt: JwtServiceCustom,
  ) {}

  // async login(dto: LoginDto) {
  //   const usuario = await this.prismaRead.users.findFirst({
  //     where: {
  //       nome: {
  //         equals: dto.nome.trim(),
  //         mode: 'insensitive',
  //       },
  //     },
  //   });

  //   if (!usuario) {
  //     throw new UnauthorizedException('Usuário ou senha inválidos');
  //   }

  //   const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);

  //   if (!senhaValida) {
  //     throw new UnauthorizedException('Usuário ou senha inválidos');
  //   }

  //   const token = this.jwt.generate({
  //     id: usuario.id,
  //     role: usuario.role,
  //   });

  //   return {
  //     access_token: token,
  //     usuario: {
  //       id: usuario.id,
  //       nome: usuario.nome,
  //       role: usuario.role,
  //     },
  //   };
  // }

  // async me(id: string) {
  //   return this.prismaRead.usuario.findUnique({
  //     where: {
  //       id,
  //     },
  //     select: {
  //       id: true,
  //       nome: true,
  //       role: true,
  //     },
  //   });
  // }

  // async editar(id: string, dto: EditarPerfilDto) {
  //   if (dto.nome === undefined && dto.senha === undefined) {
  //     return { mensagem: 'Nada para editar :)' };
  //   }

  //   try {
  //     const data: { nome?: string; senha?: string } = {};

  //     if (dto.nome !== undefined) {
  //       data.nome = dto.nome.trim();
  //     }

  //     if (dto.senha !== undefined) {
  //       data.senha = await bcrypt.hash(dto.senha, 10);
  //     }

  //     const atualizado = await this.prismaWrite.usuario.update({
  //       where: { id },
  //       data,
  //       select: {
  //         id: true,
  //         nome: true,
  //       },
  //     });

  //     return {
  //       mensagem: 'Usuário editado com sucesso',
  //       dados: atualizado,
  //     };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, {
  //       entidade: 'Usuário',
  //       mensagensPorCampo: {
  //         nome: 'Já existe um usuário com esse nome.',
  //       },
  //     });
  //   }
  // }

  logout() {
    return {
      mensagem: 'Logout realizado',
    };
  }
}
