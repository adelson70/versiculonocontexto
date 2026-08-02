import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { CreateUserDto } from './dto/create.dto.js';
import { UpdateUserDto } from './dto/update.dto.js';
import { Prisma, Role } from '../../../generated/prisma/client.js';

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

  async create(dto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, Number(process.env.BCRYPT_SALT_ROUNDS));
      const userCreated = await this.prismaWrite.users.create({data: { ...dto, password: hashedPassword }, omit: {password: true}})
      
      return { message: 'Usuário criado com sucesso', data: userCreated };

    } catch (erro) {

      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }

      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2002') {
          throw new BadRequestException('Email já existe');
        }
      }

      if (erro instanceof HttpException) {
        throw erro;
      }

      throw erro;
    }
  }

  async update(dto: UpdateUserDto) {
    try {
      let updateData: {
        name?: string;
        email?: string;
        password?: string;
        role?: Role;
      } = {};

      if (dto.name) {
        updateData.name = dto.name;
      }
      if (dto.email) {
        updateData.email = dto.email;
      }
      if (dto.password) {
        updateData.password = await bcrypt.hash(dto.password, Number(process.env.BCRYPT_SALT_ROUNDS));
      }
      if (dto.role) {
        updateData.role = dto.role;
      }

      if (!updateData) {
        throw new BadRequestException('Nenhum dado para atualizar');
      }

      await this.prismaWrite.users.update({ where: { id: dto.id }, data: updateData });
      return { message: 'Usuário atualizado com sucesso' };
    }
    catch (erro) {
      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2002') {
          throw new BadRequestException('Email já existe');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }

  async delete(id: string) {
    try {
      await this.prismaWrite.users.delete({ where: { id } });

      return { message: 'Usuário excluído com sucesso' };
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Usuário não encontrado');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }
}
