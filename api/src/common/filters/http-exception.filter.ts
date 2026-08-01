import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { LoggerCustom } from '../../infra/logger/logger.service.js';

type ErroValidacao = {
  property: string;
  value?: unknown;
  constraints?: Record<string, string>;
  children?: ErroValidacao[];
};

type CorpoExcecao = {
  message?: string | string[] | ErroValidacao[];
  mensagem?: unknown;
  mensagens?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggerCustom().definirContexto(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      response.status(status).json({
        success: false,
        messages: this.extrairMensagens(exception.getResponse()),
        data: null,
        statusCode: status,
      });
      return;
    }

    this.logger.erro('Erro não tratado', exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      messages: ['Erro interno no servidor'],
      data: null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  private extrairMensagens(corpo: string | object): string[] {
    if (typeof corpo === 'string') {
      return [corpo];
    }

    const excecao = corpo as CorpoExcecao;

    if (Array.isArray(excecao.mensagens)) {
      const mensagens = excecao.mensagens.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );

      if (mensagens.length > 0) {
        return mensagens;
      }
    }

    if (typeof excecao.mensagem === 'string' && excecao.mensagem.trim().length > 0) {
      return [excecao.mensagem];
    }

    if (this.ehListaDeErrosDeValidacao(excecao.message)) {
      return this.formatarErrosDeValidacao(excecao.message);
    }

    if (Array.isArray(excecao.message)) {
      const mensagens = excecao.message.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );

      if (mensagens.length > 0) {
        return mensagens;
      }
    }

    if (typeof excecao.message === 'string' && excecao.message.trim().length > 0) {
      return [excecao.message];
    }

    return ['Erro interno no servidor'];
  }

  private ehListaDeErrosDeValidacao(message: CorpoExcecao['message']): message is ErroValidacao[] {
    return (
      Array.isArray(message) &&
      message.length > 0 &&
      typeof message[0] === 'object' &&
      message[0] !== null &&
      'property' in message[0]
    );
  }

  private formatarErrosDeValidacao(errosValidacao: ErroValidacao[]): string[] {
    const mensagens: string[] = [];

    for (const erro of errosValidacao) {
      if (erro.value === undefined || erro.value === null || erro.value === '') {
        if (erro.constraints?.isObrigatorio) {
          mensagens.push(erro.constraints.isObrigatorio);
        } else if (erro.constraints?.isNotEmpty) {
          mensagens.push(erro.constraints.isNotEmpty);
        } else {
          mensagens.push(`O campo '${erro.property}' é obrigatório.`);
        }
      } else if (erro.constraints) {
        mensagens.push(...Object.values(erro.constraints));
      }

      if (erro.children && erro.children.length > 0) {
        mensagens.push(...this.formatarErrosDeValidacao(erro.children));
      }
    }

    return [...new Set(mensagens)];
  }
}
