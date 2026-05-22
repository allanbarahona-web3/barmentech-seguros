import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuoteLeadStatus } from '@prisma/client';
import { CreateQuoteLeadDto, UpdateQuoteLeadDto, FilterQuoteLeadsDto } from './dto';

@Injectable()
export class QuoteLeadsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuoteLeadDto) {
    return this.prisma.quoteLead.create({
      data: {
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        totalTravelers: data.totalTravelers || 1,
        passengerAges: data.passengerAges,
        wantsEmailQuote: data.wantsEmailQuote || false,
        email: data.email,
        sourceUrl: data.sourceUrl,
        detectedCountry: data.detectedCountry,
        routedPhone: data.routedPhone,
        ip: data.ip,
        userAgent: data.userAgent,
        status: QuoteLeadStatus.NEW,
      },
    });
  }

  async findAll(filters: FilterQuoteLeadsDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.destination) {
      where.destination = {
        contains: filters.destination,
        mode: 'insensitive',
      };
    }

    if (filters.startDate) {
      where.startDate = {
        gte: filters.startDate,
      };
    }

    if (filters.endDate) {
      where.endDate = {
        lte: filters.endDate,
      };
    }

    if (filters.hasEmail === 'true') {
      where.email = {
        not: null,
      };
      where.wantsEmailQuote = true;
    } else if (filters.hasEmail === 'false') {
      where.OR = [
        { email: null },
        { wantsEmailQuote: false },
      ];
    }

    const [leads, total] = await Promise.all([
      this.prisma.quoteLead.findMany({
        where,
        include: {
          contactedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.quoteLead.count({ where }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const lead = await this.prisma.quoteLead.findUnique({
      where: { id },
      include: {
        contactedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, data: UpdateQuoteLeadDto) {
    await this.findOne(id); // Verify exists

    return this.prisma.quoteLead.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
      },
      include: {
        contactedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async markAsContacted(id: string, userId: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.quoteLead.update({
      where: { id },
      data: {
        status: QuoteLeadStatus.CONTACTED,
        contactedAt: new Date(),
        contactedById: userId,
      },
      include: {
        contactedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.quoteLead.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, newLeads, contacted, converted, discarded] = await Promise.all([
      this.prisma.quoteLead.count(),
      this.prisma.quoteLead.count({ where: { status: QuoteLeadStatus.NEW } }),
      this.prisma.quoteLead.count({ where: { status: QuoteLeadStatus.CONTACTED } }),
      this.prisma.quoteLead.count({ where: { status: QuoteLeadStatus.CONVERTED } }),
      this.prisma.quoteLead.count({ where: { status: QuoteLeadStatus.DISCARDED } }),
    ]);

    return {
      total,
      byStatus: {
        new: newLeads,
        contacted,
        converted,
        discarded,
      },
    };
  }
}
