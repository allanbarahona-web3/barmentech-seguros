import { QuoteLeadStatus } from '@/lib/api/leads';

interface LeadStatusBadgeProps {
  status: QuoteLeadStatus;
}

const STATUS_CONFIG = {
  NEW: {
    label: 'Nuevo',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  CONTACTED: {
    label: 'Contactado',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  CONVERTED: {
    label: 'Convertido',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  DISCARDED: {
    label: 'Descartado',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

export default function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
