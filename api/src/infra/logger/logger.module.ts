import { Global, Module } from '@nestjs/common';

import { LoggerCustom } from './logger.service.js';

@Global()
@Module({
  providers: [LoggerCustom],
  exports: [LoggerCustom],
})
export class LoggerModule {}
