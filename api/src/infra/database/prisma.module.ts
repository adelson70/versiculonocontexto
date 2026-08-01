import { Global, Module } from '@nestjs/common';
import { PrismaReadService } from './prisma-read.service.js';
import { PrismaWriteService } from './prisma-write.service.js';

@Global()
@Module({
  providers: [PrismaReadService, PrismaWriteService],
  exports: [PrismaReadService, PrismaWriteService],
})
export class PrismaModule {}
