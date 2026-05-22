import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/password-strength.validator';

export class RegisterDto {
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

  @IsOptional()
  @IsString()
  honeypot?: string; // Campo anti-bots (debe estar vacío)
}
