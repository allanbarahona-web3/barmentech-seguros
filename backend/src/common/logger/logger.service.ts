import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

/**
 * Servicio de logging centralizado para eventos de seguridad
 * Registra: intentos de login, accesos no autorizados, operaciones críticas
 */
@Injectable()
export class SecurityLoggerService implements NestLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'barmentech-security' },
      transports: [
        // Logs de seguridad a archivo separado
        new transports.File({
          filename: 'logs/security-error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new transports.File({
          filename: 'logs/security-combined.log',
          maxsize: 5242880,
          maxFiles: 10,
        }),
        // También a consola en desarrollo
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * Eventos de seguridad específicos
   */
  logLoginAttempt(email: string, success: boolean, ip: string) {
    this.logger.info('Login attempt', {
      event: 'LOGIN_ATTEMPT',
      email,
      success,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logLoginSuccess(userId: string, email: string, ip: string) {
    this.logger.info('Login successful', {
      event: 'LOGIN_SUCCESS',
      userId,
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logLoginFailure(email: string, reason: string, ip: string) {
    this.logger.warn('Login failed', {
      event: 'LOGIN_FAILURE',
      email,
      reason,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logAccountLocked(email: string, ip: string) {
    this.logger.error('Account locked due to multiple failed attempts', {
      event: 'ACCOUNT_LOCKED',
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logUnauthorizedAccess(userId: string, resource: string, ip: string) {
    this.logger.warn('Unauthorized access attempt', {
      event: 'UNAUTHORIZED_ACCESS',
      userId,
      resource,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logFileUpload(userId: string, filename: string, size: number, type: string) {
    this.logger.info('File uploaded', {
      event: 'FILE_UPLOAD',
      userId,
      filename,
      size,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  logSuspiciousActivity(description: string, metadata: any) {
    this.logger.error('Suspicious activity detected', {
      event: 'SUSPICIOUS_ACTIVITY',
      description,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  }
}
