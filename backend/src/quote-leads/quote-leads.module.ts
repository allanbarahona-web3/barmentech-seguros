import { Module } from '@nestjs/common';
import { QuoteLeadsService } from './quote-leads.service';
import { QuoteLeadsController } from './quote-leads.controller';

@Module({
  controllers: [QuoteLeadsController],
  providers: [QuoteLeadsService],
  exports: [QuoteLeadsService],
})
export class QuoteLeadsModule {}
