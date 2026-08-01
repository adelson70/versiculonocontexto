import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MESSAGE_KEYS = new Set(['message', 'messages', 'mensagem', 'mensagens']);
const DATA_KEYS = new Set(['data', 'dados']);

function extrairMensagens(obj: Record<string, unknown>): string[] {
  const lista = obj.messages ?? obj.mensagens;

  if (Array.isArray(lista)) {
    return lista.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  const mensagem = obj.message ?? obj.mensagem;

  if (typeof mensagem === 'string' && mensagem.trim().length > 0) {
    return [mensagem];
  }

  return [];
}

function extrairDados(obj: Record<string, unknown>): unknown {
  if (obj.data !== undefined) {
    return obj.data;
  }

  if (obj.dados !== undefined) {
    return obj.dados;
  }

  const resto = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !MESSAGE_KEYS.has(key) && !DATA_KEYS.has(key)),
  );

  return Object.keys(resto).length > 0 ? resto : null;
}

function transformarResposta(data: unknown): { messages: string[]; data: unknown } {
  if (data === undefined) {
    return { messages: [], data: null };
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { messages: [], data };
  }

  const obj = data as Record<string, unknown>;

  return {
    messages: extrairMensagens(obj),
    data: extrairDados(obj),
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { messages, data: responseData } = transformarResposta(data);

        return {
          success: true,
          messages,
          data: responseData,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
