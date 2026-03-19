import AccountNav from "@/modules/account/components/account-nav"
import { B2BCustomer } from "@/types"
import React from "react"

interface AccountLayoutProps {
  customer: B2BCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = async ({
  customer,
  children,
}) => {
  return (
    <div
      className="flex-1 py-12"
      data-testid="account-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-8">
          <div>
            {customer && (
              <AccountNav
                customer={customer}
              />
            )}
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
