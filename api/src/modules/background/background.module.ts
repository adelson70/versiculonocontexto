import { Module } from '@nestjs/common';

import { BackgroundController } from './background.controller.js';
import { BackgroundService } from './background.service.js';

@Module({
  controllers: [BackgroundController],
  providers: [BackgroundService],
  exports: [BackgroundService],
})
export class BackgroundModule {}
