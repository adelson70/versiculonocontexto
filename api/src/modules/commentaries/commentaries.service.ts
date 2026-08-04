import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { CreateCommentaryDto } from './dto/create.dto.js';
import { Prisma, Role } from '../../../generated/prisma/client.js';
import { UpdateUserDto } from '../user/dto/update.dto.js';
import { UpdateCommentaryDto } from './dto/update.dto.js';

@Injectable()
export class CommentariesService {
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

  async create(dto: CreateCommentaryDto, user_id: string) {
    try {
      const verse = await this.prismaRead.verses.findFirst({
        where: {
          number: dto.number_verse,
          chapter: {
            number: dto.number_chapter,
            book: {
              slug: dto.slug_book,
            },
          },
        },
        select: { id: true },
      });

      if (!verse) {
        throw new NotFoundException('Versículo não encontrado');
      }

      const commentary = await this.prismaWrite.commentaries.create({
        data: {
          text: dto.text,
          authors_id: user_id,
          verse_id: verse.id,
        },
      });

      return { message: 'Comentário criado com sucesso', commentary };

    } catch (erro) {
      console.log('erro', erro);

      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }

      if (erro instanceof HttpException) {
        throw erro;
      }

      throw erro;
    }
  }

  async update(dto: UpdateCommentaryDto) {
    try {
      let updateData: {
        text?: string;
      } = {};

      if (dto.text) {
        updateData.text = dto.text;
      }

      if (!updateData) {
        throw new BadRequestException('Nenhum dado para atualizar');
      }

      await this.prismaWrite.commentaries.update({ where: { id: dto.id }, data: updateData });
      return { message: 'Comentário atualizado com sucesso' };
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
      await this.prismaWrite.commentaries.delete({ where: { id } });

      return { message: 'Comentário excluído com sucesso' };
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Comentário não encontrado');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }
}
