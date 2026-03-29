"use client"

import { useCart } from "@/lib/context/cart-context"
import CartToCsvButton from "@/modules/cart/components/cart-to-csv-button"
import CartTotals from "@/modules/cart/components/cart-totals"
import PromotionCode from "@/modules/checkout/components/promotion-code"
import Button from "@/modules/common/components/button"
import Divider from "@/modules/common/components/divider"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types"
import { ExclamationCircle } from "@medusajs/icons"

type SummaryProps = {
  customer: B2BCustomer | null
  spendLimitExceeded: boolean
}

const Summary = ({ customer, spendLimitExceeded }: SummaryProps) => {
  const { handleEmptyCart, cart } = useCart()

  if (!cart) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-y-4">
      <CartTotals />

      <Divider />

      <PromotionCode cart={cart} />

      <Divider className="my-6" />

      {spendLimitExceeded && (
        <div className="flex items-start gap-x-3 bg-[#0047AB]/5 p-4 rounded-lg border border-[#0047AB]/20">
          <ExclamationCircle className="text-[#0047AB] w-5 h-5 flex-shrink-0 mt-0.5" />

          <p className="text-gray-900 text-sm">
            Esta encomenda excede o seu limite de gastos.
            <br />
            Por favor, contacte o seu gestor para aprovação.
          </p>
        </div>
      )}

      <LocalizedClientLink href="/portal/pedir-orcamento">
        <Button
          className="w-full h-10 rounded-full shadow-borders-base"
        >
          Pedir Orcamento
        </Button>
      </LocalizedClientLink>

      <CartToCsvButton cart={cart} />

      <Button
        onClick={handleEmptyCart}
        className="w-full h-10 rounded-full shadow-borders-base"
        variant="secondary"
      >
        Esvaziar Carrinho
      </Button>
    </div>
  )
}

export default Summary
