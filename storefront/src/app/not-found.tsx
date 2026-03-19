import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Página não encontrada",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-neutral-50">
      <h1 className="text-4xl font-bold text-[#0047AB]">404</h1>
      <h2 className="text-xl font-semibold text-neutral-900">Página não encontrada</h2>
      <p className="text-neutral-600 text-center max-w-md">
        A página que está a tentar aceder não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-3 bg-[#0047AB] text-white font-medium rounded-md hover:bg-[#003685] transition-colors"
      >
        Voltar à página inicial
      </Link>
    </div>
  )
}
