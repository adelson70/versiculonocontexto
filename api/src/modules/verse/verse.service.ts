import { PrismaWriteService } from '../../infra/database/prisma-write.service.js';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaReadService } from '../../infra/database/prisma-read.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { getLocationByIp } from '../../common/utils/get-location-ip.js';

@Injectable()
export class VerseService {
  constructor(
    private readonly prismaRead: PrismaReadService,
    private readonly prismaWrite: PrismaWriteService,
  ) {}

  private normalizeText(value: string) {
    return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  }

  private async findBook(book: string) {
    const bySlugOrName = await this.prismaRead.books.findFirst({
      where: {
        OR: [
          { slug: { equals: book, mode: 'insensitive' } },
          { name: { equals: book, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, slug: true },
    });

    if (bySlugOrName) {
      return bySlugOrName;
    }

    const normalizedBook = this.normalizeText(book);
    const books = await this.prismaRead.books.findMany({
      select: { id: true, name: true, slug: true },
    });

    return books.find((item) => this.normalizeText(item.name) === normalizedBook) ?? null;
  }

  async list(book: string, number_chapter: number, ip: string, browser: string) {
    try {
      const bookRecord = await this.findBook(book);

      if (!bookRecord) {
        throw new NotFoundException('Livro não encontrado');
      }

      const verses = await this.prismaRead.verses.findMany({
        where: {
          chapter: {
            number: number_chapter,
            book_id: bookRecord.id,
          },
        },
        select: {
          id: true,
          number: true,
          text: true,
          chapter_id: true,
        },
        orderBy: { number: 'asc' },
      });

      if (!verses.length) {
        throw new NotFoundException('Capítulo ou versículos não encontrados');
      }

      const background = await this.prismaRead.backgrounds.findFirst({
        where: {
          chapter_id: verses[0].chapter_id,
        },
        select: {
          id: true,
          context: true,
        },
      });



      const { city, state } = await getLocationByIp(ip);

      await this.prismaWrite.access.create({
        data: {
          book: bookRecord.name,
          chapter: number_chapter.toString(),
          ip,
          browser,
          state,
          city,
        },
      });

      return {
        message: 'Versículos encontrados com sucesso',
        data: {
          book: {
            name: bookRecord.name,
            slug: bookRecord.slug,
          },
          background: background || "",
          number_chapter,
          verses,
        },
      };
    } catch (erro) {
      console.log('erro', erro);
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Livro, capítulo ou versículo não encontrado');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }

  async details(verse_id: string) {
    try {
      const verseDetails = await this.prismaRead.verses.findUnique({
        where: { id: verse_id },
        select: {
          id: true,
          number: true,
          text: true,
          chapter: {
            select: {
              number: true,
              book: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          Commentaries: {
            select: {
              id: true,
              text: true,
            },
          },
          ReferencesFrom: {
            select: {
              id: true,
              verse_reference_verse: {
                select: {
                  number: true,
                  chapter: {
                    select: {
                      number: true,
                      book: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  text: true,
                },
              },
            },
          },
        },
      });

      if (!verseDetails) {
        throw new NotFoundException('Versículo não encontrado');
      }

      return {
        message: 'Versículo encontrado com sucesso',
        data: {
          id: verseDetails.id,
          number: verseDetails.number,
          text: verseDetails.text,
          book: {
            name: verseDetails.chapter.book.name,
            slug: verseDetails.chapter.book.slug,
          },
          number_chapter: verseDetails.chapter.number,
          commentaries: verseDetails.Commentaries,
          references: verseDetails.ReferencesFrom.map((reference) => ({
            id: reference.id,
            book: reference.verse_reference_verse.chapter.book.name,
            number_chapter: reference.verse_reference_verse.chapter.number,
            number_verse: reference.verse_reference_verse.number,
            text: reference.verse_reference_verse.text
          })),
        },
      };
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2025') {
          throw new NotFoundException('Versículo não encontrado');
        }
      }
      if (erro instanceof HttpException) {
        throw erro;
      }
      throw erro;
    }
  }

}
