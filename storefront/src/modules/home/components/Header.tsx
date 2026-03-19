"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { Menu, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
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
                <LocalizedClientLink href="/">
                  <div className="text-[#0047AB] tracking-tight" style={{ fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '600' }}>
                    Rio Gaia
                  </div>
                  <div className="text-xs text-gray-600">Industrial & Artesanal</div>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <LocalizedClientLink href="/produtos" className="text-gray-700 hover:text-[#0047AB] transition-colors">
              Produtos
            </LocalizedClientLink>
            <LocalizedClientLink href="/casos-de-sucesso" className="text-gray-700 hover:text-[#0047AB] transition-colors">
              Casos de Sucesso
            </LocalizedClientLink>
            <LocalizedClientLink href="/sobre" className="text-gray-700 hover:text-[#0047AB] transition-colors">
              Sobre Nós
            </LocalizedClientLink>
            <LocalizedClientLink href="/contacto" className="text-gray-700 hover:text-[#0047AB] transition-colors">
              Contacto
            </LocalizedClientLink>
          </nav>

          {/* Client Area Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LocalizedClientLink href="/portal" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-900 transition-colors">
              <User className="w-4 h-4" />
              <span>Área de Cliente</span>
            </LocalizedClientLink>
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
              <LocalizedClientLink href="/produtos" className="text-gray-700 hover:text-[#0047AB] transition-colors">
                Produtos
              </LocalizedClientLink>
              <LocalizedClientLink href="/casos-de-sucesso" className="text-gray-700 hover:text-[#0047AB] transition-colors">
                Casos de Sucesso
              </LocalizedClientLink>
              <LocalizedClientLink href="/sobre" className="text-gray-700 hover:text-[#0047AB] transition-colors">
                Sobre Nós
              </LocalizedClientLink>
              <LocalizedClientLink href="/contacto" className="text-gray-700 hover:text-[#0047AB] transition-colors">
                Contacto
              </LocalizedClientLink>
              <LocalizedClientLink href="/portal/conta" className="flex items-center gap-2 px-4 py-2 text-[#0047AB] border border-[#0047AB] rounded-md hover:bg-[#0047AB] hover:text-white transition-colors w-full justify-center">
                <User className="w-4 h-4" />
                <span>Área de Cliente</span>
              </LocalizedClientLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
