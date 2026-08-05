import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './infra/database/database.module.js';
import { LoggerModule } from './infra/logger/logger.module.js';
import { RedisModule } from './infra/cache/redis.module.js';
import { InfraJwtModule } from './infra/auth/jwt.module.js';
import { AuthGuard } from './infra/auth/auth.guard.js';
import { RolesGuard } from './infra/auth/roles.guard.js';
import { RateLimitGuard } from './infra/auth/rate-limit.guard.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/user/user.module.js';
import { validarEnv } from './config/env.validation.js';
import { CommentariesModule } from './modules/commentaries/commentaries.module.js';
import { ReferencesModule } from './modules/references/references.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validarEnv,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
      },
    }),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    InfraJwtModule,
    AuthModule,
    UsersModule,
    CommentariesModule,
    ReferencesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
