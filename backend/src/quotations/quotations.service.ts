import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuotationStatus, UserRole } from '@prisma/client';
import { CreateQuotationDto, UpdateQuotationDto } from './dto';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuotationDto) {
    return this.prisma.quotation.create({
      data: {
        ...data,
        status: QuotationStatus.DRAFT,
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: UserRole) {
    // ADMIN y AGENT ven todas las cotizaciones
    // CLIENT solo ve las suyas
    const where = userRole === UserRole.CLIENT ? { clientId: userId } : {}; // ADMIN/AGENT ven todas

    return this.prisma.quotation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    // CLIENT solo puede ver sus propias cotizaciones
    if (userRole === UserRole.CLIENT && quotation?.clientId !== userId) {
      return null;
    }

    return quotation;
  }

  async update(id: string, data: UpdateQuotationDto) {
    return this.prisma.quotation.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.quotation.delete({
      where: { id },
    });
  }
}
