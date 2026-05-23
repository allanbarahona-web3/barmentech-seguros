import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuotationsModule } from './quotations/quotations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { SettingsModule } from './settings/settings.module';
import { StorageModule } from './storage/storage.module';
import { AdditionalServicesModule } from './additional-services/additional-services.module';
import { QuoteLeadsModule } from './quote-leads/quote-leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    MailModule,
    SettingsModule,
    QuotationsModule,
    AdditionalServicesModule,
    QuoteLeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
