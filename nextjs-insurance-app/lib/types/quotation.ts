// Tipos para el sistema de cotizaciones

export interface Coverage {
  code: string;
  description: string;
  amount: string;
  notes?: string;
}

export interface QuotationData {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  destination?: string;
  travelDates?: {
    from: string;
    to: string;
  };
  coverages: Coverage[];
  globalMaxAmount: string;
  validityTerritory?: string;
  consecutiveDays?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
}

export interface ExtractedData {
  globalMaxAmount?: string;
  coverages: Coverage[];
  validityTerritory?: string;
  consecutiveDays?: string;
  rawText?: string;
}
