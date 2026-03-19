import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Página não encontrada",
}

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 items-center justify-center min-h-[60vh] bg-neutral-50 px-4 py-20">
        <h1 className="text-4xl font-bold text-[#0047AB]">404</h1>
        <h2 className="text-xl font-semibold text-neutral-900">Página não encontrada</h2>
        <p className="text-neutral-600 text-center max-w-md">
          A página que está a tentar aceder não existe ou foi movida.
        </p>
        <LocalizedClientLink
          href="/"
          className="mt-4 px-6 py-3 bg-[#0047AB] text-white font-medium rounded-md hover:bg-[#003685] transition-colors"
        >
          Voltar à página inicial
        </LocalizedClientLink>
      </div>
      <Footer />
    </>
  )
}
