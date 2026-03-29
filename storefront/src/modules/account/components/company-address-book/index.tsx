import AddCompanyAddress from "@/modules/account/components/company-address-card/add-company-address"
import EditCompanyAddress from "@/modules/account/components/company-address-card/edit-company-address"
import { QueryCompany } from "@/types/company"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type CompanyAddressBookProps = {
  company: QueryCompany
  region: HttpTypes.StoreRegion
  isAdmin: boolean
}

const CompanyAddressBook: React.FC<CompanyAddressBookProps> = ({
  company,
  region,
  isAdmin,
}) => {
  const addresses = company.addresses || []

  if (!isAdmin && addresses.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Text className="text-ui-fg-muted">
            Nao existem moradas de envio registadas. Contacte o administrador da
            empresa para adicionar moradas.
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
        {isAdmin && <AddCompanyAddress region={region} companyId={company.id} />}
        {addresses.map((address) => (
          <EditCompanyAddress
            key={address.id}
            region={region}
            address={address}
            companyId={company.id}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default CompanyAddressBook
