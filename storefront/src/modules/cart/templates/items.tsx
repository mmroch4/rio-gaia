import { convertToLocale } from "@/lib/util/money"
import ItemFull from "@/modules/cart/components/item-full"
import { B2BCart } from "@/types/global"
import { StoreCartLineItem } from "@medusajs/types"
import { useMemo } from "react"

type ItemsTemplateProps = {
  cart: B2BCart
  showBorders?: boolean
  showTotal?: boolean
}

const ItemsTemplate = ({
  cart,
  showBorders = true,
  showTotal = true,
}: ItemsTemplateProps) => {
  const items = cart?.items
  const totalQuantity = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0),
    [cart?.items]
  )



  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-2 w-full">
        {items &&
          items.map((item: StoreCartLineItem) => {
            return (
              <ItemFull
                currencyCode={cart?.currency_code}
                showBorders={showBorders}
                key={item.id}
                item={
                  item as StoreCartLineItem & {
                    metadata?: { note?: string }
                  }
                }
              />
            )
          })}
      </div>
      {showTotal && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-start justify-between h-full self-stretch">
            <p className="text-gray-900 font-medium">Total: {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</p>
            <p className="text-gray-900 font-semibold">
              {convertToLocale({
                amount: cart?.item_total,
                currency_code: cart?.currency_code,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemsTemplate
