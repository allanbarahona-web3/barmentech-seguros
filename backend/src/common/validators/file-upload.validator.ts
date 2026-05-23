import { BadRequestException } from '@nestjs/common';

/**
 * Validador de archivos subidos
 * Previene ataques de tipo file upload malicioso
 */
export class FileUploadValidator {
  /**
   * Valida que un archivo sea una imagen válida
   */
  static validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP',
      );
    }

    // Validar extensión del archivo
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = file.originalname
      .toLowerCase()
      .match(/\.[^.]+$/)?.[0];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'Extensión de archivo no válida. Solo: .jpg, .jpeg, .png, .webp',
      );
    }

    // Validar tamaño (máximo 5MB para imágenes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Archivo demasiado grande. Máximo: 5MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Validar que el buffer no esté vacío
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('El archivo está vacío');
    }

    // Validar magic bytes (primeros bytes del archivo para detectar tipo real)
    const magicBytes = file.buffer.slice(0, 4);
    const isValidImage = this.checkImageMagicBytes(magicBytes);
    if (!isValidImage) {
      throw new BadRequestException(
        'El archivo no es una imagen válida (validación de contenido)',
      );
    }
  }

  /**
   * Valida favicon: permite JPG/PNG/WebP/ICO con limite mas estricto.
   */
  static validateFavicon(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se proporciono ningun archivo');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/x-icon',
      'image/vnd.microsoft.icon',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP, ICO',
      );
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.ico'];
    const fileExtension = file.originalname
      .toLowerCase()
      .match(/\.[^.]+$/)?.[0];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'Extension de archivo no valida. Solo: .jpg, .jpeg, .png, .webp, .ico',
      );
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Favicon demasiado grande. Maximo: 1MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('El archivo esta vacio');
    }

    const magicBytes = file.buffer.slice(0, 4);
    const isIco =
      magicBytes[0] === 0x00 &&
      magicBytes[1] === 0x00 &&
      magicBytes[2] === 0x01 &&
      magicBytes[3] === 0x00;
    const isValidImage = this.checkImageMagicBytes(magicBytes) || isIco;

    if (!isValidImage) {
      throw new BadRequestException(
        'El archivo no es una imagen/favicon valido (validacion de contenido)',
      );
    }
  }

  /**
   * Valida que un archivo sea un PDF válido
   */
  static validatePdf(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar MIME type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF');
    }

    // Validar extensión
    const fileExtension = file.originalname
      .toLowerCase()
      .match(/\.[^.]+$/)?.[0];
    if (fileExtension !== '.pdf') {
      throw new BadRequestException('La extensión del archivo debe ser .pdf');
    }

    // Validar tamaño (máximo 10MB para PDFs)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        `PDF demasiado grande. Máximo: 10MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Validar que el buffer no esté vacío
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('El archivo PDF está vacío');
    }

    // Validar magic bytes de PDF (%PDF-)
    const pdfHeader = file.buffer.slice(0, 5).toString('utf-8');
    if (!pdfHeader.startsWith('%PDF-')) {
      throw new BadRequestException(
        'El archivo no es un PDF válido (validación de contenido)',
      );
    }
  }

  /**
   * Valida los magic bytes de una imagen para detectar el tipo real
   */
  private static checkImageMagicBytes(buffer: Buffer): boolean {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return true;
    }

    // PNG: 89 50 4E 47
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return true;
    }

    // WebP: RIFF ... WEBP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46
    ) {
      return true;
    }

    return false;
  }
}
