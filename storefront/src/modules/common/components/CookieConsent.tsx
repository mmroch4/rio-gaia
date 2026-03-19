"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Cookie, X } from "lucide-react"
import { useEffect, useState } from "react"

const CONSENT_KEY = "rio-gaia-cookie-consent"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY)

    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted")
    setIsVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(CONSENT_KEY, "dismissed")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 md:flex md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4 mb-4 md:mb-0 flex-1">
            <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-[#0047AB]" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 font-semibold mb-2">
                Utilizamos Cookies
              </h3>
              <p className="text-gray-600 text-sm">
                Este website utiliza cookies para melhorar a sua experiência de navegação.
                Ao continuar a utilizar este site, concorda com a nossa{" "}
                <LocalizedClientLink
                  href="/politica-de-privacidade"
                  className="text-[#0047AB] hover:underline font-medium"
                >
                  Política de Privacidade
                </LocalizedClientLink>
                {" "}e{" "}
                <LocalizedClientLink
                  href="/termos-e-condicoes"
                  className="text-[#0047AB] hover:underline font-medium"
                >
                  Termos de Utilização
                </LocalizedClientLink>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-[#0047AB] text-white rounded-md hover:bg-[#003685] transition-colors font-semibold whitespace-nowrap"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
