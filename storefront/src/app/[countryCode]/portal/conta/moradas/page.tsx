import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"
import AddressBook from "@/modules/account/components/address-book"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold mb-2">Moradas de Envio</h1>
        <p className="text-gray-600">
          Visualize e atualize as suas moradas de envio. Pode adicionar quantas quiser.
          Guardar as suas moradas torna-as disponíveis durante o checkout.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
