import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

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
import { VerseModule } from './modules/verse/verse.module.js';
import { BackgroundModule } from './modules/background/background.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validarEnv,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: Number(process.env.THROTTLE_TTL),
          limit: Number(process.env.THROTTLE_LIMIT),
        },
      ],
      storage: new ThrottlerStorageRedisService({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      }),
      errorMessage: 'Você atingiu o limite de requisições. Por favor, tente novamente mais tarde.',
    }),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    InfraJwtModule,
    AuthModule,
    UsersModule,
    CommentariesModule,
    ReferencesModule,
    VerseModule,
    BackgroundModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
