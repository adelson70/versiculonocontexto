import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { JwtServiceCustom } from '../../infra/auth/jwt.service.js';
import { LoginDto } from './dto/create.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaRead: PrismaReadService,
    private readonly prismaWrite: PrismaWriteService,
    private readonly jwt: JwtServiceCustom,
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.prismaRead.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário ou senha inválidos');
      }

      const passwordValid = await bcrypt.compare(dto.password, user.password);
  
      if (!passwordValid) {
        throw new UnauthorizedException('Usuário ou senha inválidos');
      }
  
      const token = this.jwt.generate({
        id: user.id,
        role: user.role,
      });

      await this.prismaWrite.users.update({
        where: { id: user.id },
        data: { last_login: new Date() },
      });
  
      return {
        token,
        usuario: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        // TODO: ADD LIVROS QUE USUARIO TERA ACESSO PARA CRIAR E EDITAR REFERENCIAS E COMENTARIOS
        // books: 
        message: 'Login realizado com sucesso',
      };
    }

    catch (error){
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnauthorizedException('Usuário ou senha inválidos');
        }
      }

      throw new InternalServerErrorException('Erro ao fazer login');
    }

  }

  async me(id: string) {
    try {
      return this.prismaRead.users.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          last_login: true,
          role: true,
        },
      });
    }
    catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Erro ao buscar usuário');
      }
    }

  }

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
}
