import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

import { LoggerCustom } from '../logger/logger.service.js';
import { getDatabaseConnectionString } from './database-connection.js';

@Injectable()
export class PrismaWriteService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: LoggerCustom) {
    const adapter = new PrismaPg({
      connectionString: getDatabaseConnectionString(),
    });
    super({
      adapter,
    });
    this.logger.definirContexto(PrismaWriteService.name);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.debug('Banco de Dados Escrita: OK');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.debug('Banco de Dados Escrita: desconectado');
  }
}
