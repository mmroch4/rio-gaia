"use client"

import { useCart } from "@/lib/context/cart-context"
import CartTotals from "@/modules/cart/components/cart-totals"
import Button from "@/modules/common/components/button"
import Divider from "@/modules/common/components/divider"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import UTurnArrowRight from "@/modules/common/icons/u-turn-arrow-right"
import QuoteBillingAddress from "@/modules/quotes/components/quote-billing-address"
import QuoteDetailsForm from "@/modules/quotes/components/quote-details-form"
import QuoteShippingAddress from "@/modules/quotes/components/quote-shipping-address"
import { B2BCart, B2BCustomer } from "@/types"
import { QueryCompany } from "@/types/company"
import { Container, Heading, Text } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"

const QuoteRequestForm = ({
  cart,
  customer,
  company,
}: {
  cart: B2BCart
  customer: B2BCustomer | null
  company: QueryCompany
}) => {
  const { cart: liveCart } = useCart()
  const searchParams = useSearchParams()

  // Use live cart for real-time updates, fallback to server cart
  const activeCart = liveCart || cart

  const totalItems =
    activeCart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <div className="small:py-12 py-6 bg-white">
      <div className="content-container">
        <div className="flex flex-col py-6 gap-y-6">
          <div className="pb-3">
            <h1 className="text-gray-900 text-3xl font-bold mb-2">
              Pedir Orcamento
            </h1>
            <p className="text-gray-600">
              Preencha os dados de entrega e faturacao para o seu pedido de
              orcamento.
            </p>
          </div>

          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-6">
            <div className="flex flex-col gap-y-2">
              <LocalizedClientLink
                className="flex items-baseline gap-2 text-sm text-neutral-400 hover:text-neutral-500"
                href="/portal/carrinho"
              >
                <Button variant="secondary">
                  <UTurnArrowRight />
                  Voltar ao carrinho
                </Button>
              </LocalizedClientLink>

              <QuoteShippingAddress cart={activeCart} customer={customer} company={company} />
              <QuoteBillingAddress cart={activeCart} customer={customer} company={company} />
              <QuoteDetailsForm cart={activeCart} />
            </div>

            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-20">
                <Container className="flex flex-col gap-y-4">
                  <Heading level="h2" className="text-xl font-medium">
                    Resumo do Carrinho
                  </Heading>

                  <Text className="text-ui-fg-subtle text-sm">
                    {totalItems} {totalItems === 1 ? "artigo" : "artigos"}
                  </Text>

                  <Divider />

                  <div className="flex flex-col gap-y-2 max-h-[300px] overflow-y-auto">
                    {activeCart?.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <Text className="text-ui-fg-subtle flex-1 truncate mr-2">
                          {item.quantity}x {item.product_title}
                          {item.variant_title
                            ? ` (${item.variant_title})`
                            : ""}
                        </Text>
                      </div>
                    ))}
                  </div>

                  <Divider />

                  <CartTotals />
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteRequestForm
