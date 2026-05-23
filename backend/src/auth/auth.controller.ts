import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Ip,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rate limiting más estricto para login: 5 intentos por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    return this.authService.login(loginDto, ip);
  }

  // Rate limiting para registro: 3 registros por hora
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(registerDto, ip);
  }

  // Validar token de activación
  @SkipThrottle()
  @Get('validate-token/:token')
  async validateToken(@Param('token') token: string) {
    return this.authService.validateActivationToken(token);
  }

  // Activar cuenta de agente con token
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  @Post('activate')
  async activate(@Body() activateDto: ActivateAccountDto, @Ip() ip: string) {
    return this.authService.activateAccount(activateDto, ip);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
