"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { CartButton, CartButtonMobile } from "@/modules/layout/components/cart-button"
import SearchModal from "@/modules/search/components/modal"
import { Menu, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function ClientAreaHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Catalog Link */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0047AB] rounded flex items-center justify-center">
                <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 gap-0.5">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <div>
                <LocalizedClientLink href="/portal">
                  <div className="text-[#0047AB] tracking-tight" style={{ fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '600' }}>
                    Rio Gaia
                  </div>
                  <div className="text-xs text-gray-600">Área de Cliente</div>
                </LocalizedClientLink>
              </div>
            </div>

            {/* Desktop Catalog Link */}
            <nav className="hidden lg:flex">
              <LocalizedClientLink
                href="/portal/catalogo"
                className={`flex items-center gap-2 text-gray-700 hover:text-[#0047AB] transition-colors ${pathname?.includes('/portal/catalogo') ? 'text-[#0047AB] font-semibold' : ''}`}
              >
                <span>Catálogo</span>
              </LocalizedClientLink>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <SearchModal />
            </div>

            <LocalizedClientLink
              href="/portal/conta"
              className={`flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#0047AB] transition-colors ${pathname?.includes('/portal/conta') ? 'text-[#0047AB] font-semibold' : ''}`}
            >
              <User className="w-5 h-5" />
              <span>Conta</span>
            </LocalizedClientLink>

            <CartButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <LocalizedClientLink
                href="/portal/catalogo"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0047AB] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Catálogo</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/portal/conta"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0047AB] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Conta</span>
              </LocalizedClientLink>

              <CartButtonMobile />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
