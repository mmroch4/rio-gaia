import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"
import CompanyAddressBook from "@/modules/account/components/company-address-book"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Moradas de Envio",
  description: "Gerir moradas de envio da empresa",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region || !customer.employee?.company) {
    notFound()
  }

  const company = await retrieveCompany(customer.employee.company.id)
  const isAdmin = customer.employee.is_admin

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold mb-2">
          Moradas de Envio
        </h1>
        <p className="text-gray-600">
          Moradas de envio da empresa. Estas moradas ficam disponiveis ao pedir
          orcamentos.
          {isAdmin
            ? " Como administrador, pode adicionar, editar e remover moradas."
            : ""}
        </p>
      </div>
      <CompanyAddressBook
        company={company}
        region={region}
        isAdmin={isAdmin}
      />
    </div>
  )
}
