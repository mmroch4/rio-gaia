import OrderCard from "@/modules/account/components/order-card"
import PreviouslyPurchasedProducts from "@/modules/account/components/previously-purchased"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: B2BCustomer | null
  orders: HttpTypes.StoreOrder[] | null
  region?: HttpTypes.StoreRegion | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold mb-2">
          Visão Geral da Conta
        </h1>
        <div className="flex flex-col small:flex-row small:items-center small:justify-between gap-2">
          <p className="text-gray-600">
            Bem-vindo, <span className="font-semibold" data-testid="welcome-message" data-value={customer?.first_name}>{customer?.first_name}</span>
          </p>
          <p className="text-sm text-gray-500">
            <span data-testid="customer-email" data-value={customer?.email}>{customer?.email}</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 small:grid-cols-2 gap-6 mb-8">
        {/* Profile Completion Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-1">Perfil</h3>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-bold text-[#0047AB]"
                  data-testid="customer-profile-completion"
                  data-value={getProfileCompletion(customer)}
                >
                  {getProfileCompletion(customer)}%
                </span>
                <span className="text-sm text-gray-500 uppercase">Completo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-1">Moradas</h3>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-bold text-[#0047AB]"
                  data-testid="addresses-count"
                  data-value={customer?.addresses?.length || 0}
                >
                  {customer?.addresses?.length || 0}
                </span>
                <span className="text-sm text-gray-500 uppercase">Guardadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">
          Encomendas Recentes
        </h2>
        <div
          className="flex flex-col gap-y-2"
          data-testid="orders-wrapper"
        >
          {orders && orders.length > 0 ? (
            orders
              .slice(0, 5)
              .map((order) => <OrderCard order={order} key={order.id} />)
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500" data-testid="no-orders-message">
                Ainda não tem encomendas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Previously Purchased Section */}
      <div>
        <h2 className="text-gray-900 text-2xl font-bold mb-4">
          Produtos Comprados Anteriormente
        </h2>
        <div
          className="flex flex-col gap-y-2"
          data-testid="previously-purchased-items-wrapper"
        >
          {orders && orders.length > 0 ? (
            <PreviouslyPurchasedProducts orders={orders} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500" data-testid="no-previously-purchased-items-message">
                Nenhum produto comprado anteriormente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: B2BCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
