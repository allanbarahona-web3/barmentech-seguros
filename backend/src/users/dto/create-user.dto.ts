import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { IsStrongPassword } from '../../common/validators/password-strength.validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Contraseña es requerida' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nombre completo es requerido' })
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole, { message: 'Rol inválido. Debe ser CLIENT, AGENT o ADMIN' })
  @IsNotEmpty({ message: 'Rol es requerido' })
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
