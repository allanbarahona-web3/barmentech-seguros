// MULTI-TENANT: Force dynamic rendering para evitar cache cruzado entre tenants
export const dynamic = 'force-dynamic';

import { getPublicLegalDocBySlug } from '@/lib/api/public-settings';

interface LegalBySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegalBySlugPage({ params }: LegalBySlugPageProps) {
  const { slug } = await params;
  const doc = await getPublicLegalDocBySlug(slug);

  return (
    <main className="legal-shell bg-slate-50 min-h-screen">
      <section className="legal-card">
        <header className="mb-8 border-b border-slate-200 pb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{doc?.title || 'Documento Legal'}</h1>
          {doc?.publishedAt && (
            <p className="text-sm text-slate-500 mt-2">
              Publicado: {new Date(doc.publishedAt).toLocaleDateString('es-CR')}
            </p>
          )}
        </header>

        {doc?.contentHtml ? (
          <article
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
          />
        ) : (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            No existe un documento legal publicado para este enlace.
          </section>
        )}
      </section>
    </main>
  );
}
