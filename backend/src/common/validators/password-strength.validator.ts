import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validador personalizado para contraseñas fuertes
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // Mínimo 8 caracteres
          if (value.length < 8) return false;
          
          // Al menos una mayúscula
          if (!/[A-Z]/.test(value)) return false;
          
          // Al menos una minúscula
          if (!/[a-z]/.test(value)) return false;
          
          // Al menos un número
          if (!/\d/.test(value)) return false;
          
          // Al menos un carácter especial
          if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`;~]/.test(value)) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&* etc)';
        },
      },
    });
  };
}
