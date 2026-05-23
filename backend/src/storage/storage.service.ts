import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import sharp from 'sharp';

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private endpoint: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('DO_SPACES_REGION') || 'sfo3';
    this.endpoint =
      this.configService.get<string>('DO_SPACES_ENDPOINT') ||
      'https://sfo3.digitaloceanspaces.com';
    this.bucket =
      this.configService.get<string>('DO_SPACES_BUCKET') ||
      'seguros-barmentech';

    const accessKeyId = this.configService.get<string>('DO_SPACES_KEY');
    const secretAccessKey = this.configService.get<string>('DO_SPACES_SECRET');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('DO_SPACES_KEY and DO_SPACES_SECRET are required');
    }

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`StorageService initialized with bucket: ${this.bucket}`);
  }

  /**
   * Sube un archivo a DigitalOcean Spaces
   * @param file Buffer o contenido del archivo
   * @param key Ruta del archivo en el bucket (ej: "quotations/abc-123.pdf")
   * @param contentType MIME type del archivo
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ACL: 'public-read', // Público para que se pueda descargar
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      // URL pública del archivo
      const url = `${this.endpoint}/${this.bucket}/${key}`;

      this.logger.log(`File uploaded successfully: ${url}`);

      return {
        url,
        key,
        bucket: this.bucket,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${key}`, error);
      throw error;
    }
  }

  /**
   * Convierte una imagen a WebP y la sube a Spaces.
   * Retorna la URL final en formato .webp.
   */
  async uploadImageAsWebp(
    file: Buffer,
    key: string,
    quality = 85,
  ): Promise<UploadResult> {
    const webpBuffer = await sharp(file).rotate().webp({ quality }).toBuffer();

    const webpKey = key.replace(/\.[^/.]+$/, '.webp');
    return this.uploadFile(webpBuffer, webpKey, 'image/webp');
  }

  /**
   * Sube un archivo desde el filesystem local (para migración)
   * @param localPath Ruta local del archivo
   * @param key Ruta en el bucket
   * @param contentType MIME type
   */
  async uploadFromLocal(
    localPath: string,
    key: string,
    contentType: string,
  ): Promise<UploadResult> {
    const fs = await import('fs');
    const fileBuffer = fs.readFileSync(localPath);
    return this.uploadFile(fileBuffer, key, contentType);
  }

  /**
   * Elimina un archivo de DigitalOcean Spaces
   * @param key Ruta del archivo en el bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${key}`, error);
      throw error;
    }
  }

  /**
   * Genera una URL pública para un archivo
   * @param key Ruta del archivo en el bucket
   */
  getPublicUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  /**
   * Genera un key único para un archivo
   * @param folder Carpeta dentro del bucket (ej: "quotations", "company")
   * @param filename Nombre del archivo
   */
  generateUniqueKey(folder: string, filename: string): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);

    return `${folder}/${basename}-${timestamp}-${random}${ext}`;
  }
}
