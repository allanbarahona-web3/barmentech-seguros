import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email del cliente es requerido' })
  clientEmail: string;
}
