import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateAdditionalServiceDto, UpdateAdditionalServiceDto } from './dto';

@Injectable()
export class AdditionalServicesService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private normalizeCoverageLevels(coverageLevels: unknown): Array<{
    name: string;
    price: number;
    coverage: string;
    description: string;
  }> {
    if (!Array.isArray(coverageLevels)) {
      return [];
    }

    return coverageLevels.map((level) => {
      // class-transformer can materialize nested values as Array with named props.
      // Convert every entry to a plain object so Prisma JSON persists correctly.
      const source = Array.isArray(level)
        ? Object.fromEntries(Object.entries(level))
        : (level as Record<string, unknown>);

      return {
        name: typeof source?.name === 'string' ? source.name : '',
        price: typeof source?.price === 'number' ? source.price : Number(source?.price) || 0,
        coverage: typeof source?.coverage === 'string' ? source.coverage : '',
        description: typeof source?.description === 'string' ? source.description : '',
      };
    });
  }

  /**
   * Create new additional service (ADMIN only)
   */
  async create(createDto: CreateAdditionalServiceDto) {
    // Check if slug already exists
    const existing = await this.prisma.additionalService.findUnique({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new ConflictException('A service with this slug already exists');
    }

    return this.prisma.additionalService.create({
      data: {
        ...createDto,
        coverageLevels: this.normalizeCoverageLevels(createDto.coverageLevels || []),
        features: createDto.features || [],
      },
    });
  }

  /**
   * Get all services (public) - only active ones
   */
  async findAllPublic(category?: string) {
    return this.prisma.additionalService.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        basePrice: true,
        pricingType: true,
        coverageLevels: true,
        iconUrl: true,
        imageUrl: true,
        features: true,
      },
    });
  }

  /**
   * Get all services (ADMIN) - including inactive
   */
  async findAll(category?: string, includeInactive = false) {
    return this.prisma.additionalService.findMany({
      where: {
        ...(category && { category }),
        ...(!includeInactive && { isActive: true }),
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get single service by ID
   */
  async findOne(id: string) {
    const service = await this.prisma.additionalService.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  /**
   * Get single service by slug (public)
   */
  async findBySlug(slug: string) {
    const service = await this.prisma.additionalService.findUnique({
      where: { slug },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new NotFoundException('Service is not available');
    }

    return service;
  }

  /**
   * Update service (ADMIN only)
   */
  async update(id: string, updateDto: UpdateAdditionalServiceDto) {
    // Check if service exists
    await this.findOne(id);

    // If slug is being updated, check for conflicts
    if (updateDto.slug) {
      const existing = await this.prisma.additionalService.findUnique({
        where: { slug: updateDto.slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('A service with this slug already exists');
      }
    }

    const data: Prisma.AdditionalServiceUpdateInput = {};
    if (updateDto.name !== undefined) data.name = updateDto.name;
    if (updateDto.slug !== undefined) data.slug = updateDto.slug;
    if (updateDto.category !== undefined) data.category = updateDto.category;
    if (updateDto.shortDescription !== undefined) data.shortDescription = updateDto.shortDescription;
    if (updateDto.fullDescription !== undefined) data.fullDescription = updateDto.fullDescription;
    if (updateDto.basePrice !== undefined) data.basePrice = updateDto.basePrice;
    if (updateDto.pricingType !== undefined) data.pricingType = updateDto.pricingType;
    if (updateDto.iconUrl !== undefined) data.iconUrl = updateDto.iconUrl;
    if (updateDto.imageUrl !== undefined) data.imageUrl = updateDto.imageUrl;
    if (updateDto.isActive !== undefined) data.isActive = updateDto.isActive;
    if (updateDto.displayOrder !== undefined) data.displayOrder = updateDto.displayOrder;
    if (updateDto.features !== undefined) data.features = updateDto.features as Prisma.InputJsonValue;
    if (updateDto.coverageLevels !== undefined) {
      data.coverageLevels = this.normalizeCoverageLevels(updateDto.coverageLevels) as Prisma.InputJsonValue;
    }

    return this.prisma.additionalService.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete service (ADMIN only) - soft delete by setting isActive to false
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.additionalService.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Hard delete service (ADMIN only)
   */
  async hardDelete(id: string) {
    const service = await this.findOne(id);

    // Delete associated images from storage
    if (service.iconUrl) {
      try {
        const iconKey = service.iconUrl.split('/').pop();
        if (iconKey) {
          await this.storageService.deleteFile(`additional-services/icons/${iconKey}`);
        }
      } catch (error) {
        console.error('Error deleting icon from storage:', error);
      }
    }

    if (service.imageUrl) {
      try {
        const imageKey = service.imageUrl.split('/').pop();
        if (imageKey) {
          await this.storageService.deleteFile(`additional-services/images/${imageKey}`);
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }

    return this.prisma.additionalService.delete({
      where: { id },
    });
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const services = await this.prisma.additionalService.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return services.map((s) => s.category);
  }

  /**
   * Reorder services (ADMIN only)
   */
  async reorder(serviceIds: string[]) {
    const updates = serviceIds.map((id, index) =>
      this.prisma.additionalService.update({
        where: { id },
        data: { displayOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return { message: 'Services reordered successfully' };
  }
}
