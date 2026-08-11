import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { CreateBackgroundDto } from './dto/create.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { UpdateBackgroundDto } from './dto/update.dto.js';

@Injectable()
export class BackgroundService {
  constructor(
    private readonly prismaRead: PrismaReadService,
    private readonly prismaWrite: PrismaWriteService,
  ) {}

  async create(dto: CreateBackgroundDto, user_id: string) {
    try {
      const chapter = await this.prismaRead.chapters.findFirst({
        where: {
          number: dto.number_chapter,
          book: {
            slug: dto.slug_book,
          },
        },
        select: { id: true },
      });

      if (!chapter) {
        throw new NotFoundException('Capítulo não encontrado');
      }

      const existingBackground = await this.prismaRead.backgrounds.findUnique({
        where: { chapter_id: chapter.id },
        select: { id: true },
      });

      if (existingBackground) {
        throw new ConflictException('Contexto histórico já existe para este capítulo');
      }

      const background = await this.prismaWrite.backgrounds.create({
        data: {
          context: dto.context,
          authors_id: user_id,
          chapter_id: chapter.id,
        },
      });

      return { message: 'Contexto histórico criado com sucesso', background };

    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2002') {
          throw new ConflictException('Contexto histórico já existe para este capítulo');
        }
      }

      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }

      if (erro instanceof HttpException) {
        throw erro;
      }

      throw erro;
    }
  }

  async update(dto: UpdateBackgroundDto) {
    try {
      let updateData: {
        context?: string;
      } = {};

      if (dto.context) {
        updateData.context = dto.context;
      }

      if (!updateData) {
        throw new BadRequestException('Nenhum dado para atualizar');
      }

      await this.prismaWrite.backgrounds.update({ where: { id: dto.id }, data: updateData });
      return { message: 'Contexto histórico atualizado com sucesso' };
    }
    catch (erro) {
      if (erro instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Dados inválidos');
      }
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2002') {
          throw new ConflictException('Contexto histórico já existe para este capítulo');
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
      await this.prismaWrite.backgrounds.delete({ where: { id } });

      return { message: 'Contexto histórico excluído com sucesso' };
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Contexto histórico não encontrado');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }
}
