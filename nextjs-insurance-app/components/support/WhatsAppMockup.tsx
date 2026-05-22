import Image from "next/image";

export default function WhatsAppMockup() {
  return (
    <div className="relative flex justify-center items-center lg:justify-end">
      {/* Background decorative element */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest/50 to-transparent rounded-[40px] -rotate-3 scale-105 -z-10"></div>

      {/* Chat Phone Mockup */}
      <div className="w-full max-w-[400px] bg-slate-50 rounded-[48px] p-4 chat-shadow border-[8px] border-primary relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-primary rounded-b-2xl z-20"></div>

        <div className="bg-white rounded-[32px] overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="bg-primary-container p-4 pt-8 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtylM34HeUbl-eEcGG1jqDTCKHtPkSqzlNhlFuI0pDSnJ80r7LOaO0MJrWZljrDrAotEk8SZrErKkJicvudgdHp1lu4G-Bfx0_VPQ2yeNTU24A9HoeK4WlssIx2pxXZcS2oLjrM_htRyxGAERvPS1TvkADYpsibGK1TxiIu_6qwj7Ks47kWNKR_ywhqTObG6avIIBkmPyESMiSV_pYprzXn2wttaBRn_QMeL27ezgxFP6LV716Q4VFxipeW470-7uqM_uqSblMqpvY"
                alt="Advisor Sofia"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-headline-md text-[16px] leading-tight">
                Sofia
              </h4>
              <p className="text-secondary-fixed text-[12px] flex items-center">
                <span className="w-2 h-2 bg-secondary-fixed rounded-full mr-1.5"></span>
                En línea
              </p>
            </div>
            <span className="material-symbols-outlined text-white opacity-70">
              more_vert
            </span>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#F0F2F5] relative">
            {/* Date Tag */}
            <div className="flex justify-center">
              <span className="bg-white/80 px-3 py-1 rounded-lg text-[10px] text-outline font-medium uppercase tracking-wider">
                Hoy
              </span>
            </div>

            {/* Agent Message */}
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-on-surface text-sm font-body-md">
                ¡Hola! 👋 Soy Sofia, tu asesora de seguros. Vi que estás planeando un
                viaje. ¿En qué puedo ayudarte?
              </div>
              <span className="text-[10px] text-outline mt-1 ml-1">14:02</span>
            </div>

            {/* Traveler Message */}
            <div className="flex flex-col items-end max-w-[85%] ml-auto">
              <div className="bg-[#E7FFDB] p-3 rounded-2xl rounded-tr-none shadow-sm text-on-surface text-sm font-body-md">
                Hola Sofia, viajo a Japón en Mayo y no sé si el plan básico es
                suficiente por los costos médicos allá.
              </div>
              <div className="flex items-center space-x-1 mt-1 mr-1">
                <span className="text-[10px] text-outline">14:05</span>
                <span className="material-symbols-outlined text-[14px] text-blue-500">
                  done_all
                </span>
              </div>
            </div>

            {/* Agent Message 2 */}
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-on-surface text-sm font-body-md">
                Para Japón recomendamos el plan &quot;Global Premium&quot;. Cubre
                hasta $500k USD y tiene asistencia 24/7 en español. 🗾
              </div>
              <span className="text-[10px] text-outline mt-1 ml-1">14:06</span>
            </div>

            {/* Typing Indicator */}
            <div className="flex items-start space-x-2">
              <div className="bg-white px-3 py-2 rounded-full shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-[#F0F2F5] flex items-center space-x-2">
            <div className="bg-white rounded-full flex-1 px-4 py-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-outline">
                sentiment_satisfied
              </span>
              <span className="text-outline-variant text-sm">
                Escribe un mensaje...
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mic
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card */}
      <div className="absolute -bottom-6 -left-12 hidden md:block bg-white p-4 rounded-xl chat-shadow border border-slate-100 max-w-[200px]">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-secondary-container rounded-lg">
            <span className="material-symbols-outlined text-on-secondary-container">
              verified
            </span>
          </div>
          <span className="text-label-md font-label-md">Garantía Total</span>
        </div>
        <p className="text-[12px] text-outline leading-tight">
          Asesores expertos certificados en seguros internacionales.
        </p>
      </div>
    </div>
  );
}
