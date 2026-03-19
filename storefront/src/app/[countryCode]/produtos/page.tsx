import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Box, Package, Ruler, Weight } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Produtos Personalizáveis - Rio Gaia",
  description: "Descubra a nossa gama completa de produtos cerâmicos personalizáveis: ímanes, porta-copos e azulejos decorativos com padrões tradicionais portugueses.",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

const products = [
  {
    name: "Ímanes Cerâmicos",
    href: "/produtos/imanes-ceramicos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Lembranças práticas e decorativas com padrões tradicionais portugueses. Perfeitos para lojas de souvenirs, hotéis e museus.",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "5x5 cm / 7x7 cm" },
      { icon: Weight, label: "Peso", value: "15-25g" },
      { icon: Package, label: "Embalagem", value: "Caixa individual" },
      { icon: Box, label: "Lote mínimo", value: "100 unidades" },
    ],
  },
  {
    name: "Porta-Copos",
    href: "/produtos/porta-copos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Funcionalidade e beleza em cada peça. Porta-copos cerâmicos que protegem superfícies com estilo português autêntico.",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "10x10 cm" },
      { icon: Weight, label: "Peso", value: "80-100g" },
      { icon: Package, label: "Embalagem", value: "Conjuntos de 4 ou 6" },
      { icon: Box, label: "Lote mínimo", value: "50 unidades" },
    ],
  },
  {
    name: "Azulejos Decorativos",
    href: "/produtos/azulejos-decorativos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Arte portuguesa em cerâmica. Azulejos decorativos que transformam qualquer espaço numa galeria de tradição e beleza.",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "15x15 cm / 20x20 cm" },
      { icon: Weight, label: "Peso", value: "200-350g" },
      { icon: Package, label: "Embalagem", value: "Caixa de presente" },
      { icon: Box, label: "Lote mínimo", value: "25 unidades" },
    ],
  },
]

export default async function ProductsPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/products-hero-image.jpg)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Catálogo
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Produtos Personalizáveis
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Descubra a nossa gama completa de produtos cerâmicos com padrões tradicionais
              portugueses, perfeitos para o setor do turismo.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Nossos Produtos
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Cerâmica Portuguesa de Qualidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todos os nossos produtos são personalizáveis e produzidos com os mais altos
              padrões de qualidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <LocalizedClientLink key={idx} href={product.href}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-gray-900 mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {product.description}
                    </p>

                    {/* Specs */}
                    <div className="space-y-3">
                      {product.specs.map((spec, specIdx) => (
                        <div key={specIdx} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <spec.icon className="w-5 h-5 text-[#0047AB]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600">{spec.label}</div>
                            <div className="text-gray-900" style={{ fontWeight: '600' }}>{spec.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View Details Link */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <span className="text-[#0047AB] font-semibold hover:text-[#003685] transition-colors">
                        Ver Mais Detalhes →
                      </span>
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0047AB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Interessado nos Nossos Produtos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para receber um orçamento personalizado e
            discutir as opções de design para o seu negócio.
          </p>
          <LocalizedClientLink href="/contacto">
            <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg" style={{ fontWeight: '600' }}>
              Pedir Orçamento
            </button>
          </LocalizedClientLink>
        </div>
      </section>

      <Footer />
    </div>
  )
}
