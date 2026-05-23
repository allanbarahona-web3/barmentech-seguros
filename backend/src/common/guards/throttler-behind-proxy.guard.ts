import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

/**
 * Custom throttler guard que funciona detrás de proxies (nginx, load balancers)
 * Lee la IP real del header X-Forwarded-For
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Obtener IP real detrás de proxy
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.ip;
    return Promise.resolve(ip);
  }
}
