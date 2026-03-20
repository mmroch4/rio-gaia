import { listRegions } from "@/lib/data/regions"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Box, Check, ImageIcon, MapPin, Package, Palette, Ruler, Weight } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Ímanes Cerâmicos",
  description: "Ímanes cerâmicos personalizados com padrões tradicionais portugueses. Perfeitos para lojas de souvenirs, hotéis e museus.",
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

export default async function ImagnesCeramicosPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/products/imanes-ceramicos-hero-image.jpg)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Produto Personalizável
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Ímanes Cerâmicos
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Lembranças práticas e decorativas com padrões tradicionais portugueses.
              Perfeitos para lojas de souvenirs, hotéis e museus.
            </p>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Ímanes Cerâmicos"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
                Sobre o Produto
              </div>
              <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
                A Lembrança Perfeita de Portugal
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Os nossos ímanes cerâmicos combinam a tradição dos azulejos portugueses
                  com a praticidade de um íman de frigorífico, criando uma lembrança única
                  e funcional que os turistas adoram.
                </p>
                <p>
                  Cada peça é cuidadosamente produzida em cerâmica de alta qualidade,
                  com acabamento em azul cobalto tradicional ou cores personalizadas
                  conforme a sua marca.
                </p>
                <p>
                  Ideais para lojas de souvenirs, hotéis boutique, museus e espaços
                  culturais que procuram oferecer lembranças autênticas e de qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Opções de Personalização
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Personalize ao Seu Gosto
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos várias opções de personalização para criar ímanes únicos para o seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sizes */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Ruler className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Tamanhos Disponíveis
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  5x5 cm (compacto)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  7x7 cm (standard)
                </li>
              </ul>
            </div>

            {/* Designs */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <ImageIcon className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Designs Personalizados
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Padrões tradicionais
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Monumentos e cidades
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Logótipos e brasões
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Designs exclusivos
                </li>
              </ul>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Palette className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Cores e Acabamentos
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Azul cobalto tradicional
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Cores personalizadas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Acabamento brilhante
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Acabamento mate
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Especificações Técnicas
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Detalhes do Produto
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dimensions */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-4">
                <Ruler className="w-6 h-6 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Dimensões</h3>
              <p className="text-gray-600">5x5 cm / 7x7 cm</p>
            </div>

            {/* Weight */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-4">
                <Weight className="w-6 h-6 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Peso</h3>
              <p className="text-gray-600">15-25g</p>
            </div>

            {/* Packaging */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Embalagem</h3>
              <p className="text-gray-600">Caixa individual</p>
            </div>

            {/* Minimum Order */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Lote Mínimo</h3>
              <p className="text-gray-600">100 unidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Aplicações
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Onde Usar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ímanes cerâmicos são versáteis e adequados para diversos tipos de negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Lojas de Souvenirs
              </h3>
              <p className="text-gray-600">
                Perfeitos para lojas de lembranças em zonas turísticas. Produtos leves,
                fáceis de transportar e com grande apelo visual.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Hotéis e Alojamentos
              </h3>
              <p className="text-gray-600">
                Ofereça aos seus hóspedes uma lembrança exclusiva do hotel ou da região.
                Ideal para boutique hotels e unidades de charme.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Museus e Espaços Culturais
              </h3>
              <p className="text-gray-600">
                Reproduza peças do acervo ou crie designs exclusivos que celebrem
                a história e cultura do seu espaço.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Galeria
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Modelos e Exemplos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja alguns dos nossos modelos de ímanes cerâmicos personalizados
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Photo 1 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-1.jpg"
                alt="Íman modelo 1"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 2 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-2.jpg"
                alt="Íman modelo 2"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 3 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-3.jpg"
                alt="Íman modelo 3"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 4 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-4.jpg"
                alt="Íman modelo 4"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 5 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-5.jpg"
                alt="Íman modelo 5"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 6 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-6.jpg"
                alt="Íman modelo 6"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 7 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-7.jpg"
                alt="Íman modelo 7"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 8 */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/imanes/model-8.jpg"
                alt="Íman modelo 8"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0047AB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Interessado em Ímanes Cerâmicos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para receber um orçamento personalizado e
            discutir as opções de design para o seu negócio.
          </p>
          <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg" style={{ fontWeight: '600' }}>
            Pedir Orçamento
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
