import { Module } from '@nestjs/common';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { OpenAIService } from './openai.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { MailModule } from '../mail/mail.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [MailModule, SettingsModule],
  controllers: [QuotationsController],
  providers: [QuotationsService, OpenAIService, PdfGeneratorService],
})
export class QuotationsModule {}
