import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import { formatAmount } from "@/modules/common/components/amount-cell"
import ProfileCard from "@/modules/account/components/profile-card"
import SecurityCard from "@/modules/account/components/security-card"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Perfil",
  description: "Consulte e edite o seu perfil Rio Gaia.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  const employee = customer.employee

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold mb-6">Perfil</h1>
      </div>

      <div className="mb-8 flex flex-col gap-y-4">
        <h2 className="text-gray-900 text-xl font-semibold">
          Detalhes
        </h2>
        <ProfileCard customer={customer} />
      </div>

      {employee && (
        <div className="mb-8 flex flex-col gap-y-4">
          <h2 className="text-gray-900 text-xl font-semibold">
            Informação de Funcionário
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
              <div className="flex flex-col gap-y-1">
                <span className="text-sm font-semibold text-gray-900">Cargo</span>
                <span className="text-gray-600">
                  {employee.is_admin ? "Administrador" : "Funcionário"}
                </span>
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="text-sm font-semibold text-gray-900">Limite de Gastos</span>
                <span className="text-gray-600">
                  {employee.spending_limit > 0
                    ? formatAmount(
                        employee.spending_limit,
                        employee.company?.currency_code || "eur"
                      )
                    : "Sem limite"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-y-4">
        <h2 className="text-gray-900 text-xl font-semibold">
          Segurança
        </h2>
        <SecurityCard customer={customer} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
