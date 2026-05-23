import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

export interface ExtractedCoverageData {
  globalMaxAmount?: string;
  coverages: Array<{
    code: string;
    description: string;
    amount: string;
    notes?: string;
  }>;
  validityTerritory?: string;
  consecutiveDays?: string;
}

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractDataFromPdf(pdfPath: string): Promise<ExtractedCoverageData> {
    try {
      // Leer el PDF como base64
      const pdfBuffer = fs.readFileSync(pdfPath);
      return this.extractDataFromPdfBuffer(pdfBuffer);
    } catch (error) {
      console.error('Error extracting data from PDF:', error);
      throw new Error('Failed to extract data from PDF');
    }
  }

  async extractDataFromPdfBuffer(
    pdfBuffer: Buffer,
  ): Promise<ExtractedCoverageData> {
    try {
      const base64Pdf = pdfBuffer.toString('base64');

      // Usar GPT-4o Vision para extraer datos
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente experto en extraer información de documentos de seguros de viaje (Assist Card). 
Debes extraer los siguientes datos en formato JSON:
- globalMaxAmount: El monto máximo global (ej: "USD 6.000")
- coverages: Array de coberturas con { code, description, amount, notes }
- validityTerritory: Territorio de validez (ej: "NACIONAL - A PARTIR DE LOS 50 KM DEL DOMICILIO")
- consecutiveDays: Días consecutivos por viaje (ej: "HASTA 30 DÍAS")

Extrae TODAS las coberturas que encuentres en el documento.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extrae toda la información de coberturas de este PDF de Assist Card:',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      const parsedData = JSON.parse(content);

      return {
        globalMaxAmount: parsedData.globalMaxAmount || '',
        coverages: parsedData.coverages || [],
        validityTerritory: parsedData.validityTerritory || '',
        consecutiveDays: parsedData.consecutiveDays || '',
      };
    } catch (error) {
      console.error('Error extracting data from PDF:', error);
      throw new Error('Failed to extract data from PDF');
    }
  }
}
