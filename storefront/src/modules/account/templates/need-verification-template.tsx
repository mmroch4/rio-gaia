"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Text } from "@medusajs/ui"

const NeedVerificationTemplate = () => {
  return (
    <div>
      <Header />

      {/* Single Column Layout Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-[#0047AB]/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#0047AB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <Text className="text-4xl text-neutral-950">
                Verificação Pendente
              </Text>

              {/* Message */}
              <div className="flex flex-col gap-4 text-neutral-600">
                <p className="text-base leading-relaxed">
                  A sua conta de empresa foi criada com sucesso e está atualmente
                  pendente de verificação pela nossa equipa.
                </p>
                <p className="text-base leading-relaxed">
                  Serás contactado pela nossa equipa assim que a sua conta for verificada e poderá
                  começar a utilizar a nossa plataforma.
                </p>
              </div>

              {/* Info Box */}
              <div className="w-full p-6 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                <div className="flex items-start gap-3 text-left">
                  <svg className="w-5 h-5 text-[#0047AB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#0047AB] mb-1">Tempo de Verificação</h4>
                    <p className="text-sm text-neutral-700">A verificação é normalmente concluída em 24-48 horas.</p>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
                <LocalizedClientLink
                  href="/"
                  className="flex-1 px-6 py-3 !bg-[#0047AB] hover:!bg-[#003685] text-white rounded-md transition-colors text-center font-semibold"
                >
                  Voltar à Página Inicial
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/contacto"
                  className="flex-1 px-6 py-3 border-2 border-[#0047AB] text-[#0047AB] hover:bg-[#0047AB] hover:text-white rounded-md transition-colors text-center font-semibold"
                >
                  Contactar-nos
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default NeedVerificationTemplate
