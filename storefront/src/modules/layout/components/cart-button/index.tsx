"use client"

import { useCart } from "@/lib/context/cart-context"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { ShoppingBag } from "lucide-react"
import { useMemo } from "react"

export function CartButton() {
  const { cart } = useCart()

  const totalItems = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cart?.items]
  )

  return (
    <LocalizedClientLink href="/portal/carrinho">
      <button className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#0047AB] transition-colors">
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#0047AB] to-[#003685] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
    </LocalizedClientLink>
  )
}

export function CartButtonMobile() {
  const { cart } = useCart()

  const totalItems = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cart?.items]
  )

  return (
    <LocalizedClientLink href="/portal/carrinho">
      <button className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#0047AB] transition-colors w-full justify-start">
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#0047AB] to-[#003685] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </div>
        <span>Carrinho</span>
      </button>
    </LocalizedClientLink>
  )
}
