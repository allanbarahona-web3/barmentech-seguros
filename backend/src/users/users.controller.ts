import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  /**
   * ADMIN: Create new agent with activation email
   */
  @Roles(UserRole.ADMIN)
  @Post('agents')
  async createAgent(@Body() createUserDto: CreateUserDto) {
    // Generate activation token
    const { token, expiry } = this.authService.generateActivationToken();

    // Create agent without password (will be set on activation)
    const agent = await this.usersService.createAgentWithToken(
      {
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        phone: createUserDto.phone,
      },
      token,
      expiry,
    );

    // Send activation email
    await this.mailService.sendActivationEmail({
      to: agent.email,
      fullName: agent.fullName,
      activationToken: token,
      expiryHours: 48,
    });

    return {
      message: 'Agent created successfully. Activation email sent.',
      agent: {
        id: agent.id,
        email: agent.email,
        fullName: agent.fullName,
        role: agent.role,
        isActivated: agent.isActivated,
      },
    };
  }

  /**
   * ADMIN: List all users with optional role filter
   */
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query('role') role?: UserRole) {
    const users = await this.usersService.findAll(role);
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isActivated: user.isActivated,
      createdAt: user.createdAt,
    }));
  }

  /**
   * ADMIN: Get user by ID
   */
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isActivated: user.isActivated,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * ADMIN: Update user
   */
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  /**
   * ADMIN: Delete user (hard delete)
   */
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    if (req.user.id === id) {
      throw new BadRequestException('No puedes eliminar tu propio usuario');
    }

    await this.usersService.remove(id);
    return { message: 'Usuario eliminado permanentemente' };
  }

  /**
   * ADMIN: Resend activation email for agent
   */
  @Roles(UserRole.ADMIN)
  @Post(':id/resend-activation')
  async resendActivation(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    
    if (!user || user.role !== UserRole.AGENT) {
      return { message: 'User not found or not an agent' };
    }

    if (user.isActivated) {
      return { message: 'User is already activated' };
    }

    // Generate new token
    const { token, expiry } = this.authService.generateActivationToken();
    
    // Update user with new token
    await this.usersService.update(id, {
      activationToken: token,
      tokenExpiry: expiry,
    });

    // Resend activation email
    await this.mailService.sendActivationEmail({
      to: user.email,
      fullName: user.fullName,
      activationToken: token,
      expiryHours: 48,
    });

    return { message: 'Activation email resent successfully' };
  }
}
