"use client";

export default function ContactForm() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-label-sm font-label-sm text-outline mb-1.5">
            Nombre Completo
          </label>
          <input
            type="text"
            placeholder="Ej. Juan Pérez"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all duration-200 bg-surface-bright"
          />
        </div>

        <div className="relative">
          <label className="block text-label-sm font-label-sm text-outline mb-1.5">
            Destino
          </label>
          <input
            type="text"
            placeholder="¿A dónde viajas?"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all duration-200 bg-surface-bright"
          />
        </div>

        <div className="relative">
          <label className="block text-label-sm font-label-sm text-outline mb-1.5">
            Fechas de Viaje
          </label>
          <input
            type="text"
            placeholder="DD/MM/AAAA"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all duration-200 bg-surface-bright"
          />
        </div>

        <div className="relative">
          <label className="block text-label-sm font-label-sm text-outline mb-1.5">
            Nº Viajeros
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all duration-200 bg-surface-bright"
          />
        </div>
      </div>

      <button className="w-full py-4 bg-secondary text-white rounded-lg font-headline-md flex items-center justify-center space-x-3 transition-all duration-300 hover:brightness-110 active:scale-95 chat-shadow">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat
        </span>
        <span>Recibir asesoría por WhatsApp</span>
      </button>

      <p className="text-center text-label-sm font-label-sm text-outline">
        Atención inmediata en menos de 2 minutos
      </p>
    </div>
  );
}
