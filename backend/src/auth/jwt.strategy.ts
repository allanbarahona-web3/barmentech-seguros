import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  fullName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret =
      configService.get<string>('JWT_SECRET') ||
      'barmentech-secret-key-change-in-production';
    console.log(
      '[JwtStrategy] JWT_SECRET loaded:',
      secret?.substring(0, 20) + '...',
    );
    console.log('[JwtStrategy] JWT_SECRET length:', secret?.length);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
    };
  }
}
