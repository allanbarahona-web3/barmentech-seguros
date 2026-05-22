import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { QuoteLeadsService } from './quote-leads.service';
import { CreateQuoteLeadDto, UpdateQuoteLeadDto, FilterQuoteLeadsDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('quote-leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuoteLeadsController {
  constructor(private readonly quoteLeadsService: QuoteLeadsService) {}

  /**
   * ADMIN/AGENT: List all quote leads with filters and pagination
   */
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @Get()
  async findAll(@Query() filters: FilterQuoteLeadsDto) {
    return this.quoteLeadsService.findAll(filters);
  }

  /**
   * ADMIN/AGENT: Get statistics about leads
   */
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @Get('stats')
  async getStats() {
    return this.quoteLeadsService.getStats();
  }

  /**
   * ADMIN/AGENT: Get a specific lead by ID
   */
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.quoteLeadsService.findOne(id);
  }

  /**
   * ADMIN/AGENT: Update a lead (status, notes)
   */
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuoteLeadDto: UpdateQuoteLeadDto,
  ) {
    return this.quoteLeadsService.update(id, updateQuoteLeadDto);
  }

  /**
   * ADMIN/AGENT: Mark a lead as contacted
   */
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @Post(':id/contact')
  async markAsContacted(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.quoteLeadsService.markAsContacted(id, req.user.id);
  }

  /**
   * ADMIN: Delete a lead
   */
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.quoteLeadsService.delete(id);
    return { message: 'Lead deleted successfully' };
  }
}
