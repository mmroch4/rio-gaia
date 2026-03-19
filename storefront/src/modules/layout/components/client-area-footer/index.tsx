import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function ClientAreaFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#0047AB] rounded flex items-center justify-center">
                <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 gap-0.5">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <div>
                <LocalizedClientLink href="/portal/loja">
                  <div className="text-white" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    Rio Gaia
                  </div>
                </LocalizedClientLink>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Produção industrial de lembranças cerâmicas personalizadas para o setor do turismo em Portugal.
            </p>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>Conta</h4>
            <ul className="space-y-2 text-sm">
              <li><LocalizedClientLink href="/portal/conta" className="hover:text-[#0047AB] transition-colors">Visão Geral</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/conta/perfil" className="hover:text-[#0047AB] transition-colors">Perfil</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/conta/empresa" className="hover:text-[#0047AB] transition-colors">Empresa</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/conta/moradas" className="hover:text-[#0047AB] transition-colors">Moradas</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Orders & Quotes */}
          <div>
            <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>Encomendas</h4>
            <ul className="space-y-2 text-sm">
              <li><LocalizedClientLink href="/portal/conta/encomendas" className="hover:text-[#0047AB] transition-colors">Minhas Encomendas</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/conta/orcamentos" className="hover:text-[#0047AB] transition-colors">Orçamentos</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/catalogo" className="hover:text-[#0047AB] transition-colors">Catálogo</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/portal/carrinho" className="hover:text-[#0047AB] transition-colors">Carrinho</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+351 210 000 000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>b2b@riogaia.pt</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Zona Industrial de Lisboa<br />Portugal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-gray-400">
                © 2026 Rio Gaia. Todos os direitos reservados.
              </p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-[#0047AB] transition-colors">
                  Política de Privacidade
                </a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-[#0047AB] transition-colors">
                  Termos e Condições
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#0047AB] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#0047AB] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#0047AB] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
