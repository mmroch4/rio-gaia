import { listRegions } from "@/lib/data/regions"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Award, Check, Clock, MapPin, Package, Quote, Store, TrendingUp } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Algarve Gift Shops Network — Caso de Sucesso",
  description: "Descubra como a Rio Gaia fornece lembranças personalizadas para uma rede de 12 lojas no Algarve com entregas pontuais e qualidade consistente.",
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

export default async function CaseStudy3Page() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2VyYW1pYyUyMHdvcmtzaG9wJTIwY3JhZnRzbWFuc2hpcHxlbnwxfHx8fDE3NzAxNDk0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Caso de Sucesso
            </div>

            <h1 className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Algarve Gift Shops Network
            </h1>

            <div className="flex items-center gap-2 text-xl text-blue-100 mb-6">
              <MapPin className="w-5 h-5" />
              Algarve, Portugal
            </div>

            <p className="text-xl text-blue-100 max-w-2xl">
              Fornecimento contínuo e confiável de lembranças personalizadas para
              uma rede de 12 lojas em toda a região do Algarve.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
                O Desafio
              </div>
              <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
                Escala, Consistência e Pontualidade
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  A Algarve Gift Shops Network opera 12 lojas de souvenirs em localizações
                  estratégicas por todo o Algarve, desde Albufeira até Lagos, servindo
                  milhares de turistas durante a época alta.
                </p>
                <p>
                  O desafio era encontrar um fornecedor capaz de garantir stock consistente
                  em todas as lojas, com qualidade uniforme e entregas pontuais, especialmente
                  durante os meses de verão quando a procura dispara.
                </p>
                <p>
                  Precisavam de produtos com boa relação qualidade-preço que permitissem
                  margens saudáveis, mas que também impressionassem os turistas pela
                  autenticidade e qualidade.
                </p>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-[#0047AB]/10 to-[#0047AB]/5 rounded-lg p-8 border border-[#0047AB]/20">
              <Quote className="w-12 h-12 text-[#0047AB]/30 mb-4" />
              <p className="text-gray-700 text-xl italic mb-6">
                "Excelente relação qualidade-preço e entregas sempre pontuais. Em 3 anos
                de parceria, nunca ficámos sem stock. A Rio Gaia entende as necessidades
                do retalho turístico."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0047AB] rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Carlos Mendes</div>
                  <div className="text-gray-600 text-sm">Diretor de Compras</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              A Nossa Solução
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              O Que Fornecemos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fornecimento contínuo com gestão de stock e entregas programadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Ímanes Cerâmicos
              </h3>
              <p className="text-gray-600 mb-4">
                2.000+ unidades/mês com designs do Algarve
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  12 designs regionais
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Preços por volume
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Stock de segurança
                </li>
              </ul>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Porta-Copos e Azulejos
              </h3>
              <p className="text-gray-600 mb-4">
                800+ sets/mês de produtos premium
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Variedade de gamas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Embalagens atrativas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Margens competitivas
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Serviço de Gestão
              </h3>
              <p className="text-gray-600 mb-4">
                Acompanhamento dedicado e logística otimizada
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Entregas quinzenais
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Gestor de conta dedicado
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Reposição automática
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Resultados Alcançados
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Crescimento Sustentável
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Parceria que cresce ano após ano
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>100%</div>
              <div className="text-gray-600">Taxa de entregas pontuais</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>3.000+</div>
              <div className="text-gray-600">Peças vendidas/mês</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>35%</div>
              <div className="text-gray-600">Margem média de lucro</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>3 anos</div>
              <div className="text-gray-600">De parceria contínua</div>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h3 className="text-gray-900 mb-4 text-2xl font-semibold">Benefícios Alcançados</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Zero Ruturas de Stock</div>
                  <p className="text-gray-600">Sistema de reposição automática garante disponibilidade constante</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Redução de Custos Operacionais</div>
                  <p className="text-gray-600">Menos tempo gasto em gestão de fornecedores e encomendas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Produtos Best-Sellers</div>
                  <p className="text-gray-600">Cerâmicas Rio Gaia estão entre os 5 produtos mais vendidos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Expansão da Gama</div>
                  <p className="text-gray-600">Introdução de novos produtos sazonais com sucesso garantido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0047AB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Tem uma Rede de Lojas?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Oferecemos soluções de fornecimento em escala com gestão dedicada
            e entregas pontuais para redes de retalho.
          </p>
          <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg" style={{ fontWeight: '600' }}>
            Falar com a Nossa Equipa
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
