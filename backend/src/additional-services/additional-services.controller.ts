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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdditionalServicesService } from './additional-services.service';
import { CreateAdditionalServiceDto, UpdateAdditionalServiceDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { FileUploadValidator } from '../common/validators/file-upload.validator';

@Controller('additional-services')
export class AdditionalServicesController {
  constructor(
    private readonly additionalServicesService: AdditionalServicesService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * PUBLIC: Get all active services
   */
  @Get('public')
  async findAllPublic(@Query('category') category?: string) {
    return this.additionalServicesService.findAllPublic(category);
  }

  /**
   * PUBLIC: Get service by slug
   */
  @Get('public/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.additionalServicesService.findBySlug(slug);
  }

  /**
   * PUBLIC: Get all categories
   */
  @Get('categories')
  async getCategories() {
    return this.additionalServicesService.getCategories();
  }

  /**
   * ADMIN: Create new service
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createDto: CreateAdditionalServiceDto) {
    return this.additionalServicesService.create(createDto);
  }

  /**
   * ADMIN: Get all services (including inactive)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.additionalServicesService.findAll(
      category,
      includeInactive === 'true',
    );
  }

  /**
   * ADMIN: Get single service by ID
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.additionalServicesService.findOne(id);
  }

  /**
   * ADMIN: Update service
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAdditionalServiceDto,
  ) {
    return this.additionalServicesService.update(id, updateDto);
  }

  /**
   * ADMIN: Soft delete service
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.additionalServicesService.remove(id);
  }

  /**
   * ADMIN: Upload icon for service
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/upload-icon')
  @UseInterceptors(FileInterceptor('icon'))
  async uploadIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file
    FileUploadValidator.validateImage(file);

    // Upload to storage
    const uploadResult = await this.storageService.uploadImageAsWebp(
      file.buffer,
      `additional-services/icons/${id}-${Date.now()}.${file.mimetype.split('/')[1]}`,
    );

    // Update service
    await this.additionalServicesService.update(id, {
      iconUrl: uploadResult.url,
    });

    return { iconUrl: uploadResult.url };
  }

  /**
   * ADMIN: Upload image for service
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file
    FileUploadValidator.validateImage(file);

    // Upload to storage
    const uploadResult = await this.storageService.uploadImageAsWebp(
      file.buffer,
      `additional-services/images/${id}-${Date.now()}.${file.mimetype.split('/')[1]}`,
    );

    // Update service
    await this.additionalServicesService.update(id, {
      imageUrl: uploadResult.url,
    });

    return { imageUrl: uploadResult.url };
  }

  /**
   * ADMIN: Reorder services
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('reorder')
  async reorder(@Body() body: { serviceIds: string[] }) {
    return this.additionalServicesService.reorder(body.serviceIds);
  }
}
