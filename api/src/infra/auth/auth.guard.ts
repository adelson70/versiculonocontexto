import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator.js';
import { JwtServiceCustom } from './jwt.service.js';
import type { Role } from '../../../generated/prisma/enums.js';

export type AuthUser = {
  tipo: 'usuario';
  id: string;
  role: Role;
};

type RequestWithAuth = Request & {
  user?: AuthUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtServiceCustom,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithAuth>();
    const bearer = this.extractBearer(req);

    if (!bearer) {
      throw new UnauthorizedException('Operação não autorizada');
    }

    try {
      const payload = await this.jwt.verify(bearer);

      if (!payload?.id) {
        throw new UnauthorizedException('Operação não autorizada');
      }

      req.user = {
        tipo: 'usuario',
        id: payload.id,
        role: payload.role ?? 'OPERADOR',
      };

      return true;
    } catch {
      throw new UnauthorizedException('Operação não autorizada');
    }
  }

  private extractBearer(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return null;
    }

    const token = header.slice(7).trim();
    return token || null;
  }
}
