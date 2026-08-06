import { Module } from '@nestjs/common';

import { VerseController } from './verse.controller.js';
import { VerseService } from './verse.service.js';

@Module({
  controllers: [VerseController],
  providers: [VerseService],
  exports: [VerseService],
})
export class VerseModule {}
