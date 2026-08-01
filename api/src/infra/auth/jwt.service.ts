import { Injectable } from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';

import type { Role } from '../../../generated/prisma/enums.js';

export type JwtPayload = {
  id: string;
  role: Role;
};

@Injectable()
export class JwtServiceCustom {
  constructor(private readonly jwt: JwtService) {}

  generate(payload: JwtPayload) {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as JwtSignOptions['expiresIn'],
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwt.verifyAsync<JwtPayload>(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
