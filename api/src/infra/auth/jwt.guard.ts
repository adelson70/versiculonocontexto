import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

type JwtGuardInfo = {
  name?: string;
  message?: string;
};

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = { id: string }>(
    err: unknown,
    user: TUser | false,
    info?: JwtGuardInfo,
  ): TUser {
    if (info?.name === 'TokenExpiredError' || info?.message === 'No auth token' || err || !user) {
      throw new UnauthorizedException('Operação não autorizada');
    }

    return user;
  }
}
