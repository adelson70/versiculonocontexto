import type { NextFunction, Request, Response } from 'express';

import { LoggerCustom } from '../../infra/logger/logger.service.js';

const logger = new LoggerCustom().definirContexto('HTTP');

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    const linha = `${req.method} ${req.originalUrl} ${res.statusCode} ${duracao}ms`;

    if (res.statusCode >= 500) {
      logger.erro(linha);
    } else if (res.statusCode >= 400) {
      logger.aviso(linha);
    } else {
      logger.log(linha);
    }
  });

  next();
}
