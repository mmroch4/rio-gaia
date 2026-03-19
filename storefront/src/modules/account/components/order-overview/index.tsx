"use client"

import OrderCard from "@/modules/account/components/order-card"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-2 w-full">
        {orders.map((o) => (
          <div key={o.id}>
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-gray-900 text-xl font-semibold">Ainda não tem encomendas</h2>
      <p className="text-gray-600 text-center">
        Ainda não fez nenhuma encomenda. Vamos mudar isso!
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/portal/catalogo" passHref>
          <Button data-testid="continue-shopping-button">
            Continuar a comprar
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
