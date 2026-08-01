import { Module } from '@nestjs/common';

import { UsersController } from './user.controller.js';
import { UsersService } from './user.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
