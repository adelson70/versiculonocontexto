import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import type { AuthUser } from './auth.guard.js';
import {
  RATE_LIMIT_LOGIN_MAX,
  RATE_LIMIT_USUARIO_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from './rate-limit.constants.js';
import { RateLimitService } from './rate-limit.service.js';

type RequestWithAuth = Request & {
  user?: AuthUser;
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimit: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithAuth>();
    const path = (req.originalUrl || req.url || '').split('?')[0];
    const method = (req.method || 'GET').toUpperCase();
    const body = (req.body ?? {}) as Record<string, unknown>;

    if (method === 'POST' && path === '/auth/login') {
      const nome = this.asNonEmptyString(body.nome);
      if (nome) {
        await this.rateLimit.consume(
          `rl:login:${nome.toLowerCase()}`,
          RATE_LIMIT_LOGIN_MAX,
          RATE_LIMIT_WINDOW_SECONDS,
        );
      }
      return true;
    }

    if (req.user?.tipo === 'usuario') {
      await this.rateLimit.consume(
        `rl:usuario:${req.user.id}`,
        RATE_LIMIT_USUARIO_MAX,
        RATE_LIMIT_WINDOW_SECONDS,
      );
    }

    return true;
  }

  private asNonEmptyString(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    return trimmed || null;
  }
}
