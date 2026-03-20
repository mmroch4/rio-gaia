import { listRegions } from "@/lib/data/regions"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Award, BookOpen, Check, MapPin, Package, Quote, TrendingUp } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Museu Nacional do Azulejo — Caso de Sucesso",
  description: "Descubra como a Rio Gaia colaborou com o Museu Nacional do Azulejo para criar reproduções autênticas de padrões históricos.",
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

export default async function CaseStudy2Page() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Caso de Sucesso
            </div>

            <h1 className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Museu Nacional do Azulejo
            </h1>

            <div className="flex items-center gap-2 text-xl text-blue-100 mb-6">
              <MapPin className="w-5 h-5" />
              Lisboa, Portugal
            </div>

            <p className="text-xl text-blue-100 max-w-2xl">
              Reprodução fiel de padrões históricos em formato de souvenirs,
              preservando a autenticidade cultural portuguesa.
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
                Preservar a História em Cada Peça
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  O Museu Nacional do Azulejo, guardião de séculos de história cerâmica
                  portuguesa, procurava uma forma de tornar o seu acervo acessível aos
                  visitantes através de souvenirs de qualidade.
                </p>
                <p>
                  O desafio era reproduzir fielmente padrões históricos dos séculos XVI
                  ao XIX, mantendo a autenticidade das cores, técnicas e detalhes, mas
                  em formatos práticos e acessíveis.
                </p>
                <p>
                  Era essencial que cada peça respeitasse a integridade histórica e
                  artística dos originais, servindo também como ferramenta educativa
                  sobre a arte do azulejo português.
                </p>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-[#0047AB]/10 to-[#0047AB]/5 rounded-lg p-8 border border-[#0047AB]/20">
              <Quote className="w-12 h-12 text-[#0047AB]/30 mb-4" />
              <p className="text-gray-700 text-xl italic mb-6">
                "Parceria exemplar. A Rio Gaia respeitou meticulosamente a autenticidade
                histórica dos padrões. Os visitantes agora podem levar para casa uma
                verdadeira peça da história portuguesa."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0047AB] rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Dr. João Santos</div>
                  <div className="text-gray-600 text-sm">Diretor do Museu</div>
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
              Coleção completa de reproduções históricas para a loja do museu
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
                400 ímanes com 8 padrões históricos diferentes (séc. XVI-XIX)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Reprodução fiel
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Informação histórica incluída
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Tamanhos 5x5 e 7x7 cm
                </li>
              </ul>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Porta-Copos
              </h3>
              <p className="text-gray-600 mb-4">
                150 sets de 4 porta-copos com padrões do acervo
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  6 coleções temáticas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Base em cortiça
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Embalagem educativa
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Processo de Colaboração
              </h3>
              <p className="text-gray-600 mb-4">
                Trabalho conjunto com curadores e historiadores
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Pesquisa histórica
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Aprovação de curadores
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Testes de qualidade
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
              Impacto Cultural e Comercial
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sucesso que vai além das vendas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>92%</div>
              <div className="text-gray-600">Taxa de satisfação dos visitantes</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>800+</div>
              <div className="text-gray-600">Peças vendidas/mês</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Top 3</div>
              <div className="text-gray-600">Produtos mais vendidos</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>55%</div>
              <div className="text-gray-600">Aumento na receita da loja</div>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h3 className="text-gray-900 mb-4 text-2xl font-semibold">Benefícios Alcançados</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Preservação Cultural</div>
                  <p className="text-gray-600">Padrões históricos tornaram-se acessíveis a um público mais amplo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Educação Através de Produtos</div>
                  <p className="text-gray-600">Cada peça inclui informação histórica sobre o padrão</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Receita Sustentável</div>
                  <p className="text-gray-600">Fonte de financiamento para atividades do museu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Reconhecimento Internacional</div>
                  <p className="text-gray-600">Produtos levados por turistas para todo o mundo</p>
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
            Tem um Projeto Cultural?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Trabalhamos com museus, galerias e espaços culturais para criar
            souvenirs autênticos e de qualidade.
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
