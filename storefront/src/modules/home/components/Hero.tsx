;
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/home-hero-image.png)' }}>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>
      {/* Decorative Pattern */}
      <div className="absolute hidden sm:block inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 border-4 border-white -rotate-12"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 border-4 border-white rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div>
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Produção Industrial Portuguesa
            </div>

            <h1 className="text-white max-w-lg mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              O Coração de Portugal na Sua Loja
            </h1>

            <p className="text-xl max-w-lg text-blue-100 mb-8">
              Produção industrial de lembranças cerâmicas personalizadas para o setor do turismo
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-10">
              <LocalizedClientLink href="/contacto">
                <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2" style={{ fontWeight: '600' }}>
                  Entrar em Contacto
                  <ArrowRight className="w-5 h-5" />
                </button>
              </LocalizedClientLink>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl" style={{ fontWeight: '700' }}>500+</div>
                <div className="text-sm text-blue-100">Clientes B2B</div>
              </div>
              <div>
                <div className="text-3xl" style={{ fontWeight: '700' }}>24h</div>
                <div className="text-sm text-blue-100">Resposta Rápida</div>
              </div>
              <div>
                <div className="text-3xl" style={{ fontWeight: '700' }}>100%</div>
                <div className="text-sm text-blue-100">Produção Nacional</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
