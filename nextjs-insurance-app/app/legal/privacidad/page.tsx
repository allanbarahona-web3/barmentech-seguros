// MULTI-TENANT: Force dynamic rendering para evitar cache cruzado entre tenants
export const dynamic = 'force-dynamic';

import { getPublicLegalDocByType } from '@/lib/api/public-settings';

interface PrivacySection {
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

function getSectionDepth(text: string): number {
  const numeric = text.match(/^(\d+(?:\.\d+)*)\.?\s+/);
  if (!numeric) {
    return 1;
  }

  return Math.min(3, numeric[1].split('.').length);
}

function isPrivacyHeading(text: string): boolean {
  if (!text) {
    return false;
  }

  // Titulos numerados (1., 2.1, etc.)
  if (/^(\d+(?:\.\d+)*)\.?\s+["'“”‘’¿¡(\[]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(text)) {
    return true;
  }

  // Titulos en mayuscula usados en textos legales
  if (text.length >= 8 && text.length <= 110 && /^[A-ZÁÉÍÓÚÜÑ0-9\s,.;:()/-]+$/.test(text)) {
    return true;
  }

  // Titulo principal de seccion sin numeracion, p.ej. "Política de Privacidad"
  if (/^pol[ií]tica de privacidad$/i.test(text)) {
    return true;
  }

  return false;
}

function formatPrivacyDocument(contentHtml: string): {
  formattedHtml: string;
  sections: PrivacySection[];
} {
  const lines = String(contentHtml || '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<\/?p>/gi, '\n')
    .split('\n')
    .map((line) => normalizeSpaces(decodeBasicEntities(stripHtmlTags(line))))
    .filter(Boolean);

  const sections: PrivacySection[] = [];
  const usedIds = new Set<string>();
  const htmlParts: string[] = [];

  const uniqueId = (title: string): string => {
    const base = slugify(title) || 'seccion';
    let candidate = base;
    let n = 2;
    while (usedIds.has(candidate)) {
      candidate = `${base}-${n}`;
      n += 1;
    }
    usedIds.add(candidate);
    return candidate;
  };

  for (const line of lines) {
    if (isPrivacyHeading(line)) {
      const id = uniqueId(line);
      const depth = getSectionDepth(line);
      const tag = depth >= 3 ? 'h4' : depth === 2 ? 'h3' : 'h2';

      sections.push({ id, title: line, depth });
      htmlParts.push(`<${tag} id="${id}" class="legal-anchor">${line}</${tag}>`);
      continue;
    }

    htmlParts.push(`<p>${line}</p>`);
  }

  return {
    formattedHtml: htmlParts.join('\n'),
    sections,
  };
}

export default async function PrivacyLegalPage() {
  const doc = await getPublicLegalDocByType('privacy_policy');
  const formatted = doc?.contentHtml
    ? formatPrivacyDocument(doc.contentHtml)
    : { formattedHtml: '', sections: [] as PrivacySection[] };

  return (
    <main className="legal-shell bg-slate-50 min-h-screen">
      <section className="legal-card">
        <header className="mb-8 border-b border-slate-200 pb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{doc?.title || 'Política de Privacidad'}</h1>
          {doc?.publishedAt && (
            <p className="text-sm text-slate-500 mt-2">
              Publicado: {new Date(doc.publishedAt).toLocaleDateString('es-CR')}
            </p>
          )}
        </header>

        {formatted.sections.length > 0 && (
          <nav className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3">Indice de secciones</h2>
            <div className="grid gap-2">
              {formatted.sections.map((item) => (
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
            Este tenant aún no tiene una Política de Privacidad publicada.
          </section>
        )}
      </section>
    </main>
  );
}
