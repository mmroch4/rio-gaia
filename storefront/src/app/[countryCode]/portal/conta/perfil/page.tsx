import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import ProfileCard from "@/modules/account/components/profile-card"
import SecurityCard from "@/modules/account/components/security-card"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

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
