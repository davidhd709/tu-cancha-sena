import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'bussines' | 'client';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
<<<<<<< HEAD
<<<<<<< HEAD
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret',
=======
      secretOrKey: config.get<string>('JWT_SECRET'),
>>>>>>> f40dbff57e416aca8204ab8dff93aff2d7c2c718
=======
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret',
>>>>>>> 6177fb0351d68851c81c6e38858f283d8ff5a188
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inválido o inactivo');
    }
    return { sub: user.id, email: user.email, role: user.role };
  }
}
