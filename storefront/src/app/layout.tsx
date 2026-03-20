import { getBaseURL } from "@/lib/util/env"
import { CookieConsent } from "@/modules/common/components/CookieConsent"
import "@/styles/globals.css"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | Rio Gaia",
    default: "Rio Gaia — Cerâmica Personalizada para Turismo",
  },
  description:
    "Produção industrial de lembranças cerâmicas personalizadas para o setor do turismo em Portugal. Ímanes, porta-copos e azulejos decorativos.",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "Rio Gaia",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt" data-mode="light" className={GeistSans.variable}>
      <body className="bg-background text-foreground min-h-screen">
        <main className="relative">{props.children}</main>
        <Toaster className="z-[99999]" position="bottom-left" />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
