import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.log(`[JwtAuthGuard] Validating request to: ${request.url}`);
    this.logger.log(`[JwtAuthGuard] Authorization header: ${authHeader ? authHeader.substring(0, 30) + '...' : 'MISSING'}`);
    
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`[JwtAuthGuard] Authentication failed:`, { 
        error: err?.message, 
        info: info?.message,
        user: user?.email 
      });
    } else {
      this.logger.log(`[JwtAuthGuard] Authentication successful for user: ${user.email}`);
    }
    
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}
