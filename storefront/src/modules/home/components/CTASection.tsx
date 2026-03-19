import { ArrowRight, Phone, Mail, Download } from "lucide-react";

export function CTASection() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0047AB] to-[#003685] rounded-2xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
                Pronto para Começar a Parceria?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Solicite o nosso catálogo completo de revenda ou peça um orçamento personalizado para os seus lotes
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2" style={{ fontWeight: '600' }}>
                  <Download className="w-5 h-5" />
                  Solicitar Catálogo de Revenda
                </button>
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Pedir Orçamento para Lotes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Ligue-nos
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              De segunda a sexta, 9h-18h
            </p>
            <a href="tel:+351210000000" className="text-[#0047AB] hover:underline" style={{ fontWeight: '600' }}>
              +351 210 000 000
            </a>
          </div>

          {/* Email */}
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Envie Email
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Resposta em 24h úteis
            </p>
            <a href="mailto:b2b@azulejarte.pt" className="text-[#0047AB] hover:underline" style={{ fontWeight: '600' }}>
              b2b@azulejarte.pt
            </a>
          </div>

          {/* Visit */}
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Visite a Fábrica
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Marque uma visita presencial
            </p>
            <p className="text-[#0047AB]" style={{ fontWeight: '600' }}>
              Zona Industrial de Lisboa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
