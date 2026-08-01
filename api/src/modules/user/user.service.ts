import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { tratarErroPrisma } from '../../common/errors/prisma-error.mapper.js';
import { CreateUserDto } from './dto/create.dto.js';
import { UpdateUserDto } from './dto/update.dto.js';

const USER_SELECT = {
  id: true,
  nome: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

const ERRO_USUARIO = {
  entidade: 'Usuário',
  mensagensPorCampo: {
    nome: 'Já existe um usuário com esse nome.',
  },
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaRead: PrismaReadService,
    private readonly prismaWrite: PrismaWriteService,
  ) {}

  // async listar() {
  //   try {
  //     const usuarios = await this.prismaRead.usuario.findMany({
  //       select: USUARIO_SELECT,
  //       orderBy: [{ role: 'asc' }, { nome: 'asc' }],
  //     });

  //     return { dados: { usuarios } };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, ERRO_USUARIO);
  //   }
  // }

  // async criar(dto: CriarUsuarioDto) {
  //   try {
  //     const senha = await bcrypt.hash(dto.senha, 10);

  //     const usuario = await this.prismaWrite.usuario.create({
  //       data: { nome: dto.nome.trim(), senha, role: dto.role },
  //       select: USUARIO_SELECT,
  //     });

  //     return { mensagem: 'Usuário criado com sucesso', dados: usuario };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, ERRO_USUARIO);
  //   }
  // }

  // async editar(id: string, dto: EditarUsuarioDto) {
  //   if (dto.nome === undefined && dto.senha === undefined && dto.role === undefined) {
  //     return { mensagem: 'Nada para editar :)' };
  //   }

  //   try {
  //     if (dto.role !== undefined && dto.role !== 'ADMIN') {
  //       await this.garantirNaoUltimoAdmin(id);
  //     }

  //     const data: {
  //       nome?: string;
  //       senha?: string;
  //       role?: EditarUsuarioDto['role'];
  //     } = {};

  //     if (dto.nome !== undefined) {
  //       data.nome = dto.nome.trim();
  //     }

  //     if (dto.senha !== undefined) {
  //       data.senha = await bcrypt.hash(dto.senha, 10);
  //     }

  //     if (dto.role !== undefined) {
  //       data.role = dto.role;
  //     }

  //     const atualizado = await this.prismaWrite.usuario.update({
  //       where: { id },
  //       data,
  //       select: USUARIO_SELECT,
  //     });

  //     return { mensagem: 'Usuário editado com sucesso', dados: atualizado };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, ERRO_USUARIO);
  //   }
  // }

  // async deletar(id: string, solicitanteId: string) {
  //   try {
  //     if (id === solicitanteId) {
  //       throw new BadRequestException('Você não pode excluir o seu próprio usuário.');
  //     }

  //     await this.garantirNaoUltimoAdmin(id);

  //     await this.prismaWrite.usuario.delete({ where: { id } });

  //     return { mensagem: 'Usuário excluído com sucesso' };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, ERRO_USUARIO);
  //   }
  // }

  // async forcarLogout(id: string) {
  //   try {
  //     const usuario = await this.prismaRead.usuario.findUniqueOrThrow({
  //       where: { id },
  //       select: { id: true },
  //     });

  //     this.websocket.forcarLogout(usuario.id);

  //     return { mensagem: 'Logout solicitado' };
  //   } catch (erro) {
  //     throw tratarErroPrisma(erro, ERRO_USUARIO);
  //   }
  // }

  // private async garantirNaoUltimoAdmin(id: string) {
  //   const alvo = await this.prismaRead.usuario.findUnique({
  //     where: { id },
  //     select: { role: true },
  //   });

  //   if (alvo?.role !== 'ADMIN') {
  //     return;
  //   }

  //   const outrosAdmins = await this.prismaRead.usuario.count({
  //     where: { role: 'ADMIN', id: { not: id } },
  //   });

  //   if (outrosAdmins === 0) {
  //     throw new BadRequestException('Não é possível remover o último administrador.');
  //   }
  // }
}
