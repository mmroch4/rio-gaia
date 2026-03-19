import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { Box, Package, PresentationIcon, Ruler, Weight } from "lucide-react";

const products = [
  {
    name: "Ímanes Cerâmicos",
    href: "/products/imanes-ceramicos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "5x5 cm / 7x7 cm" },
      { icon: Weight, label: "Peso", value: "15-25g" },
      { icon: Package, label: "Embalagem", value: "Caixa individual" },
      { icon: Box, label: "Lote mínimo", value: "100 unidades" },
    ],
  },
  {
    name: "Porta-Copos",
    href: "/products/porta-copos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "10x10 cm" },
      { icon: Weight, label: "Peso", value: "80-100g" },
      { icon: Package, label: "Embalagem", value: "Set de 4 ou 6" },
      { icon: Box, label: "Lote mínimo", value: "50 sets" },
    ],
  },
  {
    name: "Azulejos Decorativos",
    href: "/products/azulejos-decorativos",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    specs: [
      { icon: Ruler, label: "Dimensões", value: "15x15 cm / 20x20 cm" },
      { icon: Weight, label: "Peso", value: "200-350g" },
      { icon: Package, label: "Embalagem", value: "Caixa de presente" },
      { icon: Box, label: "Lote mínimo", value: "25 unidades" },
    ],
  },
];

export function TechnicalSpecs() {
  return (
    <section id="produtos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
            Especificações Técnicas para Revenda
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Produtos Personalizáveis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Todas as peças são fabricadas em cerâmica de alta qualidade com acabamento em azul cobalto tradicional português
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <ProductCard key={"technical-specs-product-card-" + idx} product={product} />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <LocalizedClientLink href="/products">
            <button className="px-8 py-4 bg-[#0047AB] text-white rounded-md hover:bg-[#003685] transition-colors shadow-md" style={{ fontWeight: '600' }}>
              Ver Todos os Produtos →
            </button>
          </LocalizedClientLink>
        </div>


        {/* Display Stands Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-[#0047AB] rounded-lg flex items-center justify-center">
                <PresentationIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                Expositores Disponíveis
              </h3>
              <p className="text-gray-600">
                Fornecemos expositores personalizados em madeira para otimizar a apresentação dos produtos na sua loja. Disponíveis em vários tamanhos para balcões e vitrines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: { name: string; href: string; image: string; specs: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[] } }) {
  return (
    <LocalizedClientLink href={product.href}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
          <h3 className="text-gray-900 mb-6" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
            {product.name}
          </h3>

          {/* Specs */}
          <div className="space-y-4">
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

          {/* CTA Button */}
          {/* <button className="w-full mt-6 px-4 py-3 bg-[#0047AB] text-white rounded-md hover:bg-[#003685] transition-colors">
          Ver Mais Detalhes
        </button> */}
        </div>
      </div>
    </LocalizedClientLink>
  );
}