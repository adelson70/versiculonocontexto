import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { CreateReferenceDto } from './dto/create.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { UpdateReferenceDto } from './dto/update.dto.js';

@Injectable()
export class ReferencesService {
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

  async create(dto: CreateReferenceDto, user_id: string) {
    try {
      const [verseFrom, verseTo] = await Promise.all([
        this.prismaRead.verses.findFirst({
          where: {
            number: dto.number_verse_from,
            chapter: {
              number: dto.number_chapter_from,
              book: { slug: dto.slug_book_from },
            },
          },
          select: { id: true },
        }),
        this.prismaRead.verses.findFirst({
          where: {
            number: dto.number_verse_to,
            chapter: {
              number: dto.number_chapter_to,
              book: { slug: dto.slug_book_to },
            },
          },
          select: { id: true },
        }),
      ]);

      if (!verseFrom) {
        throw new NotFoundException('Versículo de origem não encontrado');
      }

      if (!verseTo) {
        throw new NotFoundException('Versículo de destino não encontrado');
      }

      const reference = await this.prismaWrite.references.create({
        data: {
          verse_id: verseFrom.id,
          verse_reference_id: verseTo.id,
          authors_id: user_id,
        },
      });

      return { message: 'Referência criada com sucesso', reference };

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

  async update(dto: UpdateReferenceDto) {
    try {
      const verseTo = await this.prismaRead.verses.findFirst({
        where: {
          number: dto.number_verse_to,
          chapter: {
            number: dto.number_chapter_to,
            book: { slug: dto.slug_book_to },
          },
        },
        select: { id: true },
      });

      if (!verseTo) {
        throw new NotFoundException('Versículo de destino não encontrado');
      }

      await this.prismaWrite.references.update({
        where: { id: dto.id },
        data: { verse_reference_id: verseTo.id },
      });

      return { message: 'Referência atualizada com sucesso' };
    }
    catch (erro) {
      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Referência não encontrada');
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
      await this.prismaWrite.references.delete({ where: { id } });

      return { message: 'Referência excluída com sucesso' };
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Referência não encontrada');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }
}
