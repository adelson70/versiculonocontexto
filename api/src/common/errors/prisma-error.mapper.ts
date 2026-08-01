import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../../../generated/prisma/client.js';
import { LoggerCustom } from '../../infra/logger/logger.service.js';

const logger = new LoggerCustom().definirContexto('PrismaError');

type OpcoesErroPrisma = {
  entidade: string;
  mensagensPorCampo?: Record<string, string>;
};

export function tratarErroPrisma(erro: unknown, opcoes: OpcoesErroPrisma): HttpException {
  if (erro instanceof HttpException) {
    return erro;
  }

  const { entidade, mensagensPorCampo } = opcoes;

  if (erro instanceof Prisma.PrismaClientKnownRequestError) {
    if (erro.code === 'P2002') {
      const campos = extrairCampos(erro.meta?.target);
      const campoComMensagem = campos.find((campo) => mensagensPorCampo?.[campo]);

      if (campoComMensagem && mensagensPorCampo) {
        return new ConflictException(mensagensPorCampo[campoComMensagem]);
      }

      if (campos.length > 0) {
        return new ConflictException(
          `Já existe um registro de ${entidade} com este valor de '${campos.join(', ')}'.`,
        );
      }

      return new ConflictException(`Já existe um registro de ${entidade} com estes dados.`);
    }

    if (erro.code === 'P2025') {
      return new NotFoundException(`${entidade} não encontrado(a).`);
    }

    if (erro.code === 'P2003') {
      return new BadRequestException(
        `Operação inválida: ${entidade} possui vínculo com outro registro.`,
      );
    }

    if (erro.code === 'P2000') {
      return new BadRequestException('Um dos valores enviados excede o tamanho permitido.');
    }

    logger.erro(`Erro Prisma não mapeado (${erro.code}) em ${entidade}`, erro);

    return new InternalServerErrorException(
      `Não foi possível concluir a operação em ${entidade}. Tente novamente.`,
    );
  }

  if (erro instanceof Prisma.PrismaClientValidationError) {
    logger.erro(`Erro de validação Prisma em ${entidade}`, erro);

    return new BadRequestException('Os dados enviados são inválidos para esta operação.');
  }

  logger.erro(`Erro inesperado em ${entidade}`, erro);

  return new InternalServerErrorException(
    `Não foi possível concluir a operação em ${entidade}. Tente novamente.`,
  );
}

function extrairCampos(target: unknown): string[] {
  if (Array.isArray(target)) {
    return target.map(String);
  }

  if (typeof target === 'string' && target.length > 0) {
    return [target];
  }

  return [];
}
