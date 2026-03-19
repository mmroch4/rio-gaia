import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ShoppingCart } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-[#0047AB]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-[#0047AB]" />
        </div>

        <h1 className="text-gray-900 text-2xl font-bold mb-3">
          O Seu Carrinho Está Vazio
        </h1>

        <p className="text-gray-600 mb-8">
          Não tem nada no seu carrinho. Explore os nossos produtos e adicione os artigos que pretende encomendar.
        </p>

        <LocalizedClientLink
          href="/portal/catalogo"
          className="inline-block bg-gradient-to-r from-[#0047AB] to-[#003685] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          Explorar Produtos
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
