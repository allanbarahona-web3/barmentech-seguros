import { apiClient } from './client';

export type QuoteLeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'DISCARDED';

export interface QuoteLead {
  id: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  totalTravelers: number;
  passengerAges: string | null;
  wantsEmailQuote: boolean;
  email: string | null;
  sourceUrl: string | null;
  detectedCountry: string | null;
  routedPhone: string | null;
  ip: string | null;
  userAgent: string | null;
  status: QuoteLeadStatus;
  notes: string | null;
  contactedAt: string | null;
  contactedById: string | null;
  createdAt: string;
  updatedAt: string;
  contactedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface LeadsListResponse {
  leads: QuoteLead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsStatsResponse {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    converted: number;
    discarded: number;
  };
}

export interface FilterLeadsParams {
  status?: QuoteLeadStatus;
  destination?: string;
  startDate?: string;
  endDate?: string;
  hasEmail?: 'true' | 'false';
  page?: number;
  limit?: number;
}

export interface UpdateLeadData {
  status?: QuoteLeadStatus;
  notes?: string;
}

/**
 * Get list of quote leads with filters and pagination
 */
export async function getLeads(params?: FilterLeadsParams): Promise<LeadsListResponse> {
  const response = await apiClient.get<LeadsListResponse>('/quote-leads', { params });
  return response.data;
}

/**
 * Get statistics about leads
 */
export async function getLeadsStats(): Promise<LeadsStatsResponse> {
  const response = await apiClient.get<LeadsStatsResponse>('/quote-leads/stats');
  return response.data;
}

/**
 * Get a specific lead by ID
 */
export async function getLeadById(id: string): Promise<QuoteLead> {
  const response = await apiClient.get<QuoteLead>(`/quote-leads/${id}`);
  return response.data;
}

/**
 * Update a lead (status, notes)
 */
export async function updateLead(id: string, data: UpdateLeadData): Promise<QuoteLead> {
  const response = await apiClient.patch<QuoteLead>(`/quote-leads/${id}`, data);
  return response.data;
}

/**
 * Mark a lead as contacted
 */
export async function markLeadAsContacted(id: string): Promise<QuoteLead> {
  const response = await apiClient.post<QuoteLead>(`/quote-leads/${id}/contact`);
  return response.data;
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string): Promise<void> {
  await apiClient.delete(`/quote-leads/${id}`);
}
