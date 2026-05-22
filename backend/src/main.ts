import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import * as express from 'express';

function parseAllowedOriginsFromEnv(): string[] {
  const rawOrigins = process.env.CORS_ORIGINS ?? '';
  const fromCorsOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultLocalOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3004',
  ];

  // Keep FRONTEND_URL for backward compatibility.
  const backwardCompatibleOrigins = [process.env.FRONTEND_URL].filter(
    Boolean,
  ) as string[];

  return Array.from(
    new Set([
      ...defaultLocalOrigins,
      ...backwardCompatibleOrigins,
      ...fromCorsOrigins,
    ]),
  );
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurar límite de tamaño de body para prevenir ataques DoS
  app.use(express.json({ limit: '10mb' })); // Máximo 10MB para JSON
  app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Máximo 10MB para form data
  
  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
      transform: true, // Transforma tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos implícitamente
      },
    }),
  );
  
  // Helmet - Seguridad de headers HTTP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      // Headers de seguridad adicionales
      hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny', // Prevenir clickjacking
      },
      noSniff: true, // X-Content-Type-Options: nosniff
      xssFilter: true, // X-XSS-Protection: 1; mode=block
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    }),
  );
  
  // Servir archivos estáticos desde uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Habilitar CORS para el frontend Next.js
  const allowedOrigins = parseAllowedOriginsFromEnv();

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  // Prefijo global para las APIs
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📋 API: http://localhost:${port}/api`);
  console.log(`🔒 Security: Helmet + Throttler + File Validation`);
  console.log(`📝 Logging: Security events → logs/security-*.log`);
}
bootstrap();
