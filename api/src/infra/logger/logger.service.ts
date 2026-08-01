import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerCustom {
  private logger = new Logger('App');

  definirContexto(contexto: string): this {
    this.logger = new Logger(contexto);
    return this;
  }

  log(mensagem: string) {
    this.logger.log(mensagem);
  }

  debug(mensagem: string) {
    this.logger.debug(mensagem);
  }

  aviso(mensagem: string) {
    this.logger.warn(mensagem);
  }

  erro(mensagem: string, erro?: unknown) {
    if (erro === undefined) {
      this.logger.error(mensagem);
      return;
    }

    this.logger.error(mensagem, this.detalhar(erro));
  }

  private detalhar(erro: unknown): string {
    if (erro instanceof Error) {
      return erro.stack ?? erro.message;
    }

    if (typeof erro === 'string') {
      return erro;
    }

    return JSON.stringify(erro);
  }
}
