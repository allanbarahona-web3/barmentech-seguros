import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Contraseña es requerida' })
  password: string;

  @IsOptional()
  @IsString()
  honeypot?: string; // Campo anti-bots (debe estar vacío)
}
