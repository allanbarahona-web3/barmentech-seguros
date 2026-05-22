import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';

function resolvePgSslConfig() {
  const certPath = process.env.PGSSLROOTCERT?.trim();
  const certPem = process.env.PGSSLROOTCERT_PEM?.trim();
  const certBase64 = process.env.PGSSLROOTCERT_BASE64?.trim();

  let ca: string | undefined;

  if (certPem) {
    ca = certPem;
  } else if (certBase64) {
    ca = Buffer.from(certBase64, 'base64').toString('utf8');
  } else if (certPath) {
    ca = fs.readFileSync(certPath, 'utf8');
  }

  if (!ca) {
    return undefined;
  }

  return {
    ca,
    rejectUnauthorized: true,
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: resolvePgSslConfig(),
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
