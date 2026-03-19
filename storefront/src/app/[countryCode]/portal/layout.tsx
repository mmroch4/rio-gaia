import { CartProvider } from "@/lib/context/cart-context"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { listCartFreeShippingPrices } from "@/lib/data/fulfillment"
import { getBaseURL } from "@/lib/util/env"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import CartMismatchBanner from "@/modules/layout/components/cart-mismatch-banner"
import { ClientAreaFooter } from "@/modules/layout/components/client-area-footer"
import { ClientAreaHeader } from "@/modules/layout/components/client-area-header"
import FreeShippingPriceNudge from "@/modules/shipping/components/free-shipping-price-nudge"
import { StoreFreeShippingPrice } from "@/types/shipping-option/http"
import { ArrowUpRightMini } from "@medusajs/icons"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: {
  children: React.ReactNode, params: Promise<{ countryCode: string }>
}) {
  const customer = await retrieveCustomer().catch(() => null)

  const params = await props.params
  const { countryCode } = params

  if (!customer) {
    redirect(`/${countryCode}/conta/entrar`)
  }

  if (!customer?.employee?.company) {
    return <><h1>Erro inesperado</h1><p>A empresa associada ao seu perfil não foi encontrada. Entre em contato com o suporte.</p></>
  }

  const company = await retrieveCompany(customer.employee.company.id)

  if (!company.verified) {
    redirect(`/${countryCode}/conta/verificacao-pendente`)
  }

  const cart = await retrieveCart()

  let freeShippingPrices: StoreFreeShippingPrice[] = []

  if (cart) {
    freeShippingPrices = await listCartFreeShippingPrices(cart.id)
  }

  return (
    <>
      <CartProvider cart={cart}>
        <ClientAreaHeader />
      </CartProvider>

      <div className="flex items-center text-white justify-center small:p-4 p-2 text-center bg-gradient-to-r from-[#0047AB] via-[#0047AB] to-[#003685] small:gap-2 gap-1 text-sm">
        <div className="flex flex-col small:flex-row small:gap-2 gap-1 items-center">
          <span className="flex items-center gap-2 font-medium">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>

            Novos produtos disponíveis com preços exclusivos
          </span>

          <LocalizedClientLink
            className="group hover:opacity-90 transition-opacity underline underline-offset-2 font-semibold self-end small:self-auto flex items-center gap-1"
            href="/portal/catalogo"
          >
            Ver Catálogo
            <ArrowUpRightMini className="inline" />
          </LocalizedClientLink>
        </div>
      </div>

      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      <div className="bg-white">
        {props.children}
      </div>

      <ClientAreaFooter />

      {cart && freeShippingPrices && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          freeShippingPrices={freeShippingPrices}
        />
      )}
    </>
  )
}
