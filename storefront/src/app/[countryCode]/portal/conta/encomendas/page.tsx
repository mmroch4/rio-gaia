import { listOrders } from "@/lib/data/orders"
import OrderOverview from "@/modules/account/components/order-overview"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  return (
    <div
      className="w-full flex flex-col gap-y-8"
      data-testid="orders-page-wrapper"
    >
      <div>
        <h1 className="text-gray-900 text-3xl font-bold mb-2">Encomendas</h1>
      </div>

      <div>
        <h2 className="text-gray-900 text-xl font-semibold mb-4">
          Encomendas Concluídas
        </h2>

        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
