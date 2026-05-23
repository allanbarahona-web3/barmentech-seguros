import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // Verificar si el email ya existe
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.CLIENT,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isActivated: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isActivated: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Hard delete: eliminar definitivamente de la base de datos
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      // Restricciones de FK (ej: agente con cotizaciones asociadas)
      if (error?.code === 'P2003') {
        throw new BadRequestException(
          'No se puede eliminar este usuario porque tiene registros asociados. Desactivalo o reasigna sus datos primero.',
        );
      }

      throw error;
    }
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return false;

    return bcrypt.compare(password, user.password);
  }

  /**
   * Find user by activation token
   */
  async findByActivationToken(token: string) {
    return this.prisma.user.findUnique({
      where: { activationToken: token },
    });
  }

  /**
   * Activate account and set password
   */
  async activateAccount(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActivated: true,
        activationToken: null, // Limpiar token usado
        tokenExpiry: null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isActivated: true,
      },
    });
  }

  /**
   * Create agent with activation token (without password)
   */
  async createAgentWithToken(
    data: {
      email: string;
      fullName: string;
      phone?: string;
    },
    activationToken: string,
    tokenExpiry: Date,
  ) {
    // Verificar si el email ya existe
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        password: null, // Sin contraseña hasta activación
        role: UserRole.AGENT,
        isActivated: false,
        activationToken,
        tokenExpiry,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isActivated: true,
        createdAt: true,
      },
    });
  }
}
