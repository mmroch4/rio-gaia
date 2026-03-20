import { listRegions } from "@/lib/data/regions"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Award, Building2, Heart, Sparkles, Target, Users } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a Rio Gaia - Produção industrial de lembranças cerâmicas personalizadas para o setor do turismo em Portugal",
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

export default async function AboutPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero-image.png)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Sobre a Rio Gaia
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Tradição Portuguesa com Escala Industrial
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Há mais de uma década a criar lembranças cerâmicas que celebram a cultura portuguesa,
              combinando artesanato tradicional com capacidade de produção industrial.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 shadow-md">
              <div className="w-16 h-16 bg-[#0047AB] rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-gray-900 mb-4" style={{ fontSize: '2rem', fontWeight: '700' }}>
                Nossa Missão
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Fornecer lembranças cerâmicas de alta qualidade que capturam a essência de Portugal,
                permitindo que hotéis, museus e lojas de turismo ofereçam aos seus clientes peças
                autênticas e memoráveis que celebram a nossa rica herança cultural.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 shadow-md">
              <div className="w-16 h-16 bg-[#0047AB] rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-gray-900 mb-4" style={{ fontSize: '2rem', fontWeight: '700' }}>
                Nossa Visão
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ser a referência nacional em produção industrial de lembranças cerâmicas personalizadas,
                reconhecida pela excelência na qualidade, inovação no design e compromisso com a
                preservação das tradições artesanais portuguesas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Os Nossos Valores
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              O Que Nos Define
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Princípios que guiam o nosso trabalho e relacionamento com clientes e parceiros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Controlo rigoroso em todas as etapas de produção para garantir que cada peça
                atende aos mais altos padrões de qualidade e durabilidade.
              </p>
            </div>

            {/* Tradition */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Tradição Portuguesa
              </h3>
              <p className="text-gray-600">
                Respeito profundo pelas técnicas artesanais tradicionais, adaptadas para
                produção em escala sem comprometer a autenticidade.
              </p>
            </div>

            {/* Partnership */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Parceria de Confiança
              </h3>
              <p className="text-gray-600">
                Relacionamentos duradouros baseados em transparência, comunicação clara e
                compromisso com o sucesso dos nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-[#0047AB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Rio Gaia em Números
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Resultados que demonstram o nosso compromisso com a excelência
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>10+</div>
              <div className="text-blue-100">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>500+</div>
              <div className="text-blue-100">Clientes B2B</div>
            </div>
            <div className="text-center">
              <div className="mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>50K+</div>
              <div className="text-blue-100">Peças Produzidas/Ano</div>
            </div>
            <div className="text-center">
              <div className="mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>100%</div>
              <div className="text-blue-100">Produção Nacional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Facility */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2VyYW1pYyUyMHdvcmtzaG9wJTIwY3JhZnRzbWFuc2hpcHxlbnwxfHx8fDE3NzAxNDk0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Instalações Rio Gaia"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
                As Nossas Instalações
              </div>
              <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
                Produção Industrial com Alma Artesanal
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  As nossas instalações em Portugal combinam tecnologia moderna com técnicas
                  tradicionais de cerâmica, permitindo-nos produzir em grande escala sem
                  comprometer a qualidade artesanal.
                </p>
                <p>
                  Equipados com fornos industriais de última geração e uma equipa experiente
                  de artesãos, conseguimos garantir consistência e excelência em cada peça
                  que produzimos.
                </p>
                <p>
                  O nosso processo de controlo de qualidade rigoroso assegura que apenas as
                  melhores peças chegam aos nossos clientes, mantendo os padrões elevados
                  que nos tornaram referência no setor.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0047AB] rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Localização Estratégica</div>
                  <div className="text-gray-600">Produção 100% nacional em Portugal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Pronto para Trabalhar Connosco?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contacto para discutir como podemos ajudar o seu negócio com
            lembranças cerâmicas personalizadas de qualidade superior.
          </p>
          <button className="px-8 py-4 bg-[#0047AB] text-white rounded-md hover:bg-[#003685] transition-colors shadow-lg" style={{ fontWeight: '600' }}>
            Entrar em Contacto
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
