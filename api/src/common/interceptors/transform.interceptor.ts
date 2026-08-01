import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type RespostaService = {
  mensagem?: unknown;
  mensagens?: unknown;
  dados?: unknown;
};

function ehEnvelope(data: unknown): data is RespostaService {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    ('mensagem' in data || 'mensagens' in data || 'dados' in data)
  );
}

function extrairMensagens(data: RespostaService): string[] {
  if (Array.isArray(data.mensagens)) {
    return data.mensagens.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  if (typeof data.mensagem === 'string' && data.mensagem.trim().length > 0) {
    return [data.mensagem];
  }

  return [];
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<Response>();

        let mensagens: string[] = [];
        let dados: unknown = null;

        if (ehEnvelope(data)) {
          mensagens = extrairMensagens(data);
          dados = data.dados !== undefined ? data.dados : null;
        } else if (data !== undefined) {
          dados = data;
        }

        return {
          sucesso: true,
          mensagens,
          dados,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
