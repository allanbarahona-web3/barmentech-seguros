import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '@prisma/client';
import { LoginDto, RegisterDto } from './dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { SecurityLoggerService } from '../common/logger/logger.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

// Account lockout: almacena intentos fallidos por email
interface LoginAttempt {
  count: number;
  lockedUntil: Date | null;
}

@Injectable()
export class AuthService {
  private loginAttempts = new Map<string, LoginAttempt>();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 15;
  private securityLogger: SecurityLoggerService;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.securityLogger = new SecurityLoggerService();
  }

  async login(loginDto: LoginDto, ip: string = 'unknown') {
    // Honeypot: Si el campo está lleno, es un bot
    if (loginDto.honeypot && loginDto.honeypot.trim() !== '') {
      this.securityLogger.logSuspiciousActivity('Honeypot triggered', {
        email: loginDto.email,
        ip,
      });
      throw new BadRequestException('Bot detected');
    }

    const { email, password } = loginDto;

    // Verificar si la cuenta está bloqueada
    const lockStatus = this.checkAccountLockout(email);
    if (lockStatus.isLocked) {
      this.securityLogger.logLoginFailure(
        email,
        `Account locked until ${lockStatus.lockedUntil?.toISOString()}`,
        ip,
      );
      throw new UnauthorizedException(
        `Too many failed attempts. Account locked until ${lockStatus.lockedUntil?.toLocaleString()}`,
      );
    }

    // Validar credenciales
    const isValid = await this.usersService.validatePassword(email, password);
    
    if (!isValid) {
      // Incrementar intentos fallidos
      this.recordFailedAttempt(email);
      const attempts = this.loginAttempts.get(email);
      
      this.securityLogger.logLoginFailure(
        email,
        `Invalid credentials (attempt ${attempts?.count}/${this.MAX_LOGIN_ATTEMPTS})`,
        ip,
      );

      if (attempts && attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
        this.securityLogger.logAccountLocked(email, ip);
        throw new UnauthorizedException(
          `Too many failed attempts. Account locked for ${this.LOCKOUT_DURATION_MINUTES} minutes.`,
        );
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.isActive) {
      this.securityLogger.logLoginFailure(email, 'User not found or inactive', ip);
      throw new UnauthorizedException('User not found or inactive');
    }

    // Login exitoso: limpiar intentos fallidos
    this.loginAttempts.delete(email);
    this.securityLogger.logLoginSuccess(user.id, user.email, ip);

    // Generar JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto, ip: string = 'unknown') {
    // Honeypot: Si el campo está lleno, es un bot
    if (registerDto.honeypot && registerDto.honeypot.trim() !== '') {
      this.securityLogger.logSuspiciousActivity('Honeypot triggered on register', {
        email: registerDto.email,
        ip,
      });
      throw new BadRequestException('Bot detected');
    }

    // Registrar siempre como CLIENT
    // Excluir honeypot antes de crear usuario
    const { honeypot, ...userDataClean } = registerDto;
    const user = await this.usersService.create({
      ...userDataClean,
      role: UserRole.CLIENT,
    });

    this.securityLogger.log(`New user registered: ${user.email}`, 'AuthService');

    // Enviar email de bienvenida de forma asíncrona (no bloquea la respuesta)
    this.mailService.sendWelcomeEmail({
      to: user.email,
      fullName: user.fullName,
    }).catch((error) => {
      this.securityLogger.log(`Failed to send welcome email to ${user.email}: ${error.message}`, 'AuthService');
    });

    // Auto-login después de registro
    return this.login({
      email: registerDto.email,
      password: registerDto.password,
    }, ip);
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  /**
   * Account lockout helpers
   */
  private checkAccountLockout(email: string): { isLocked: boolean; lockedUntil: Date | null } {
    const attempt = this.loginAttempts.get(email);
    
    if (!attempt || !attempt.lockedUntil) {
      return { isLocked: false, lockedUntil: null };
    }

    // Verificar si el lockout ha expirado
    if (new Date() > attempt.lockedUntil) {
      this.loginAttempts.delete(email);
      return { isLocked: false, lockedUntil: null };
    }

    return { isLocked: true, lockedUntil: attempt.lockedUntil };
  }

  private recordFailedAttempt(email: string): void {
    const attempt = this.loginAttempts.get(email) || { count: 0, lockedUntil: null };
    attempt.count++;

    // Si alcanza el máximo, bloquear cuenta
    if (attempt.count >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutEnd = new Date();
      lockoutEnd.setMinutes(lockoutEnd.getMinutes() + this.LOCKOUT_DURATION_MINUTES);
      attempt.lockedUntil = lockoutEnd;
    }

    this.loginAttempts.set(email, attempt);
  }

  /**
   * Generate activation token for new agent
   * Returns token and expiry date (48 hours from now)
   */
  generateActivationToken(): { token: string; expiry: Date } {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 48); // Token válido por 48 horas
    
    return { token, expiry };
  }

  /**
   * Validate activation token without activating
   * Returns validity status and user email
   */
  async validateActivationToken(token: string): Promise<{ valid: boolean; email?: string; message?: string }> {
    try {
      const user = await this.usersService.findByActivationToken(token);

      if (!user) {
        return { valid: false, message: 'Token inválido o no encontrado.' };
      }

      if (user.isActivated) {
        return { valid: false, message: 'Esta cuenta ya fue activada. Inicia sesión.' };
      }

      if (user.tokenExpiry && new Date() > user.tokenExpiry) {
        return { valid: false, message: 'El token ha expirado. Contacta al administrador.' };
      }

      return { valid: true, email: user.email };
    } catch (error) {
      this.securityLogger.logSuspiciousActivity('Error validating activation token', { token: token.substring(0, 10) + '...' });
      return { valid: false, message: 'Error al validar el token.' };
    }
  }

  /**
   * Activate agent account with token
   */
  async activateAccount(activateDto: ActivateAccountDto, ip: string = 'unknown') {
    const { token, password } = activateDto;

    // Buscar usuario por token
    const user = await this.usersService.findByActivationToken(token);

    if (!user) {
      this.securityLogger.logSuspiciousActivity('Invalid activation token used', {
        token: token.substring(0, 10) + '...',
        ip,
      });
      throw new BadRequestException('Invalid or expired activation token');
    }

    // Verificar si el token ha expirado
    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      this.securityLogger.log(`Expired activation token for user: ${user.email}`, 'AuthService');
      throw new BadRequestException('Activation token has expired. Please contact administrator.');
    }

    // Verificar si ya está activado
    if (user.isActivated) {
      throw new BadRequestException('Account is already activated. Please login.');
    }

    // Activar cuenta y establecer contraseña
    await this.usersService.activateAccount(user.id, password);

    this.securityLogger.log(`Account activated successfully: ${user.email}`, 'AuthService');

    // Auto-login después de activación
    return this.login({
      email: user.email,
      password,
    }, ip);
  }
}
