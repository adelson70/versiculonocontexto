import { Module } from '@nestjs/common';

import { CommentariesController } from './commentaries.controller.js';
import { CommentariesService } from './commentaries.service.js';

@Module({
  controllers: [CommentariesController],
  providers: [CommentariesService],
  exports: [CommentariesService],
})
export class CommentariesModule {}
