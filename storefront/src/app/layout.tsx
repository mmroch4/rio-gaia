import { getBaseURL } from "@/lib/util/env"
import { CookieConsent } from "@/modules/common/components/CookieConsent"
import "@/styles/globals.css"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
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
