import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';

export interface QuotationPdfData {
  quotationId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  destination?: string;
  travelDateFrom?: Date;
  travelDateTo?: Date;
  globalMaxAmount: string;
  validityTerritory?: string;
  consecutiveDays?: string;
  coverages: Array<{
    code: string;
    description: string;
    amount: string;
    notes?: string;
  }>;
  createdAt: Date;
}

@Injectable()
export class PdfGeneratorService {
  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
  ) {}

  async generateQuotationPdf(data: QuotationPdfData): Promise<string> {
    // Obtener settings dinámicos de la DB
    const settings = await this.settingsService.getSettings();

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'letter' });
        const chunks: Buffer[] = [];

        // Capturar el PDF en memoria
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', async () => {
          try {
            // Combinar chunks en un solo buffer
            const pdfBuffer = Buffer.concat(chunks);
            
            // Subir a DigitalOcean Spaces
            const key = this.storageService.generateUniqueKey(
              'quotations',
              `cotizacion-${data.quotationId}.pdf`,
            );
            const result = await this.storageService.uploadFile(
              pdfBuffer,
              key,
              'application/pdf',
            );
            
            resolve(result.url);
          } catch (error) {
            reject(error);
          }
        });

        // Header con información dinámica de la empresa
        doc
          .fontSize(20)
          .fillColor('#2563eb')
          .text(settings.companyName || 'Barmentech Seguros', { align: 'center' })
          .moveDown(0.5);

        // Información de contacto dinámica
        if (settings.email) {
          doc
            .fontSize(10)
            .fillColor('#6b7280')
            .text(settings.email, { align: 'center' });
        }
        
        // Mostrar primer teléfono disponible
        const phoneNumbers = settings.phoneNumbers as any[];
        if (phoneNumbers && phoneNumbers.length > 0) {
          doc.text(`${phoneNumbers[0].country}: ${phoneNumbers[0].phone}`, { align: 'center' });
        }
        
        if (settings.website) {
          doc.text(settings.website, { align: 'center' });
        }
        
        doc.moveDown(1);
        
        // Título
        doc
          .fontSize(24)
          .fillColor('#111827')
          .text('COTIZACIÓN DE SEGURO DE VIAJE', { align: 'center' })
          .moveDown(0.5);

        // Línea divisoria
        doc
          .strokeColor('#2563eb')
          .lineWidth(2)
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown(1);

        // Información del cliente
        doc.fontSize(14).fillColor('#2563eb').text('Datos del Cliente', { underline: true }).moveDown(0.5);

        doc.fontSize(10).fillColor('#111827');
        doc.text(`Nombre: ${data.clientName}`);
        if (data.clientEmail) doc.text(`Email: ${data.clientEmail}`);
        if (data.clientPhone) doc.text(`Teléfono: ${data.clientPhone}`);
        if (data.destination) doc.text(`Destino: ${data.destination}`);
        
        if (data.travelDateFrom && data.travelDateTo) {
          const dateFrom = new Date(data.travelDateFrom).toLocaleDateString('es-ES');
          const dateTo = new Date(data.travelDateTo).toLocaleDateString('es-ES');
          doc.text(`Fechas de viaje: ${dateFrom} - ${dateTo}`);
        }
        
        doc.moveDown(1);

        // Información general de la cobertura
        doc.fontSize(14).fillColor('#2563eb').text('Cobertura General', { underline: true }).moveDown(0.5);

        doc.fontSize(10).fillColor('#111827');
        doc.text(`Monto Máximo Global: ${data.globalMaxAmount}`, { bold: true });
        if (data.validityTerritory) doc.text(`Validez Territorial: ${data.validityTerritory}`);
        if (data.consecutiveDays) doc.text(`Días Consecutivos: ${data.consecutiveDays}`);
        doc.moveDown(1);

        // Tabla de coberturas
        doc.fontSize(14).fillColor('#2563eb').text('Coberturas Incluidas', { underline: true }).moveDown(0.5);

        // Headers de la tabla
        const tableTop = doc.y;
        const colCode = 50;
        const colDescription = 120;
        const colAmount = 450;

        doc
          .fontSize(9)
          .fillColor('#ffffff')
          .rect(colCode, tableTop, 500, 20)
          .fill('#2563eb');

        doc.fillColor('#ffffff');
        doc.text('Código', colCode + 5, tableTop + 5, { width: 60 });
        doc.text('Descripción', colDescription + 5, tableTop + 5, { width: 320 });
        doc.text('Monto', colAmount + 5, tableTop + 5, { width: 90 });

        let currentY = tableTop + 25;

        // Rows de la tabla
        data.coverages.forEach((coverage, index) => {
          const bgColor = index % 2 === 0 ? '#f3f4f6' : '#ffffff';
          
          doc.rect(colCode, currentY, 500, 20).fill(bgColor);

          doc.fillColor('#111827').fontSize(8);
          doc.text(coverage.code, colCode + 5, currentY + 5, { width: 60 });
          doc.text(coverage.description, colDescription + 5, currentY + 5, { width: 320 });
          doc.text(coverage.amount, colAmount + 5, currentY + 5, { width: 90 });

          currentY += 20;

          // Si hay notas, agregar una fila extra
          if (coverage.notes) {
            doc.rect(colCode, currentY, 500, 15).fill('#fef3c7');
            doc.fillColor('#92400e').fontSize(7);
            doc.text(`Nota: ${coverage.notes}`, colCode + 5, currentY + 3, { width: 490 });
            currentY += 15;
          }

          // Nueva página si es necesario
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }
        });

        // Footer dinámico con información de la empresa
        doc.y = 720;
        doc
          .fontSize(8)
          .fillColor('#6b7280')
          .text('Respaldado por Assist Card', { align: 'center' })
          .text(`Fecha de emisión: ${new Date(data.createdAt).toLocaleDateString('es-ES')}`, { align: 'center' })
          .moveDown(0.3);
          
        // Información de contacto en footer
        if (settings.companyName) {
          doc.text(settings.companyName, { align: 'center' });
        }
        if (settings.email) {
          doc.text(settings.email, { align: 'center' });
        }
        
        // Redes sociales si existen
        const socialMedia = settings.socialMedia as any;
        if (socialMedia && Object.keys(socialMedia).length > 0) {
          const socialLinks = Object.entries(socialMedia)
            .filter(([_, url]) => url)
            .map(([platform, _]) => platform)
            .join(' | ');
          if (socialLinks) {
            doc.text(`Síguenos: ${socialLinks}`, { align: 'center' });
          }
        }
        
        doc.moveDown(0.3);
        doc.text('Este documento es una cotización y no constituye un contrato de seguro.', { align: 'center' })
          .text('Para activar la cobertura, debe proceder con el pago y emisión formal de la póliza.', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
