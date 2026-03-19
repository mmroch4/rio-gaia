import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import CompanyCard from "@/modules/account/components/company-card"
import EmployeesCard from "@/modules/account/components/employees-card"
import { notFound } from "next/navigation"

export default async function Company() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !customer?.employee?.company) return notFound()

  const company = await retrieveCompany(customer.employee.company.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col gap-y-4">
        <h2 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
          Detalhes da Empresa
        </h2>
        <CompanyCard company={company} regions={regions} />
      </div>

      <div className="mb-8 flex flex-col gap-y-4">
        <h2 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
          Funcionários
        </h2>
        <EmployeesCard company={company} />
      </div>
    </div>
  )
}
