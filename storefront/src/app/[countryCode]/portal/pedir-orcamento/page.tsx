import { CartProvider } from "@/lib/context/cart-context"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import QuoteRequestForm from "@/modules/quotes/templates/quote-request-form"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Pedir Orcamento",
  description: "Preencha os dados para o seu pedido de orcamento",
}

export default async function QuoteRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const { countryCode } = await params
  const { step } = await searchParams
  const cart = await retrieveCart().catch(() => null)
  const customer = await retrieveCustomer()

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect(`/${countryCode}/portal/carrinho`)
  }

  if (!customer || !customer.employee?.company) {
    redirect(`/${countryCode}/portal/carrinho`)
  }

  const company = await retrieveCompany(customer.employee.company.id)

  if (!step) {
    redirect(
      `/${countryCode}/portal/pedir-orcamento?step=shipping-address`
    )
  }

  return (
    <CartProvider cart={cart}>
      <QuoteRequestForm cart={cart} customer={customer} company={company} />
    </CartProvider>
  )
}
