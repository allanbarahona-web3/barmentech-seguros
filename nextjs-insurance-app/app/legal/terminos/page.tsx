// MULTI-TENANT: Force dynamic rendering para evitar cache cruzado entre tenants
export const dynamic = 'force-dynamic';

import { getPublicLegalDocByType } from '@/lib/api/public-settings';

interface TermsSection {
  id: string;
  title: string;
  depth: number;
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]+>/g, '');
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'");
}

function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function slugify(value: string): string {
  return normalizeSpaces(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function isIndexLine(text: string): boolean {
  return /\.{5,}\s*\d+\s*$/.test(text);
}

function extractIndexTitle(text: string): string {
  return normalizeSpaces(text.replace(/\.{5,}\s*\d+\s*$/, ''));
}

function parseSectionDepth(text: string): number {
  if (/^[A-Z]\.\s+/.test(text)) {
    return 1;
  }

  const numeric = text.match(/^(\d+(?:\.\d+)*)\.?\s+/);
  if (!numeric) {
    return 0;
  }

  const depth = numeric[1].split('.').length;
  return Math.min(3, depth);
}

function isSectionLine(text: string): boolean {
  if (/^[A-Z]\.\s+[A-ZÁÉÍÓÚÜÑ]/.test(text)) {
    return true;
  }

  return /^(\d+(?:\.\d+)*)\.?\s+[A-ZÁÉÍÓÚÜÑ]/.test(text);
}

function formatTermsDocument(contentHtml: string): {
  formattedHtml: string;
  indexSections: TermsSection[];
} {
  const safeHtml = String(contentHtml || '');
  const lines = safeHtml
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<\/?p>/gi, '\n')
    .split('\n')
    .map((line) => normalizeSpaces(decodeBasicEntities(stripHtmlTags(line))))
    .filter(Boolean);

  const sections: TermsSection[] = [];
  const usedIds = new Set<string>();

  const buildUniqueId = (title: string): string => {
    const base = slugify(title) || 'seccion';
    let candidate = base;
    let suffix = 2;
    while (usedIds.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(candidate);
    return candidate;
  };

  const headingMap = new Map<string, string>();

  for (const line of lines) {
    if (!isSectionLine(line)) {
      continue;
    }

    const key = normalizeSpaces(line).toLowerCase();
    if (headingMap.has(key)) {
      continue;
    }

    const id = buildUniqueId(line);
    headingMap.set(key, id);
    sections.push({
      id,
      title: line,
      depth: parseSectionDepth(line),
    });
  }

  const indexSections: TermsSection[] = [];
  const paragraphs: string[] = [];

  for (const line of lines) {
    if (isIndexLine(line)) {
      const title = extractIndexTitle(line);
      const target = headingMap.get(title.toLowerCase()) || '';

      if (target) {
        indexSections.push({
          id: target,
          title,
          depth: parseSectionDepth(title),
        });
      }
      continue;
    }

    if (isSectionLine(line)) {
      const sectionId = headingMap.get(line.toLowerCase()) || buildUniqueId(line);
      const depth = parseSectionDepth(line);
      const tag = depth >= 3 ? 'h4' : depth === 2 ? 'h3' : 'h2';
      paragraphs.push(`<${tag} id="${sectionId}" class="legal-anchor">${line}</${tag}>`);
      continue;
    }

    paragraphs.push(`<p>${line}</p>`);
  }

  const uniqueIndex = new Map<string, TermsSection>();
  for (const item of indexSections) {
    if (!uniqueIndex.has(item.id)) {
      uniqueIndex.set(item.id, item);
    }
  }

  return {
    formattedHtml: paragraphs.join('\n'),
    indexSections: Array.from(uniqueIndex.values()),
  };
}

export default async function TermsLegalPage() {
  const doc = await getPublicLegalDocByType('terms_conditions');
  const formatted = doc?.contentHtml
    ? formatTermsDocument(doc.contentHtml)
    : { formattedHtml: '', indexSections: [] as TermsSection[] };

  return (
    <main className="legal-shell bg-slate-50 min-h-screen">
      <section className="legal-card">
        <header className="mb-8 border-b border-slate-200 pb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{doc?.title || 'Términos y Condiciones'}</h1>
          {doc?.publishedAt && (
            <p className="text-sm text-slate-500 mt-2">
              Publicado: {new Date(doc.publishedAt).toLocaleDateString('es-CR')}
            </p>
          )}
        </header>

        {formatted.indexSections.length > 0 && (
          <nav className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3">Indice de secciones</h2>
            <div className="grid gap-2">
              {formatted.indexSections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm md:text-[15px] text-blue-800 hover:text-blue-900 hover:underline"
                  style={{ paddingLeft: `${Math.max(0, item.depth - 1) * 14}px` }}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </nav>
        )}

        {doc?.contentHtml ? (
          <article
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: formatted.formattedHtml }}
          />
        ) : (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Este tenant aún no tiene Términos y Condiciones publicados.
          </section>
        )}
      </section>
    </main>
  );
}
