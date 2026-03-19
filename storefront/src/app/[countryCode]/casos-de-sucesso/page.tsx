import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { MapPin, Quote } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Casos de Sucesso - Rio Gaia",
  description: "Descubra como a Rio Gaia ajudou hotéis, museus e lojas em todo Portugal a criar lembranças cerâmicas personalizadas de qualidade.",
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

const cases = [
  {
    client: "Hotel Quinta da Regaleira",
    location: "Sintra",
    href: "/casos-de-sucesso/hotel-quinta-regaleira",
    image: "https://images.unsplash.com/photo-1712089295178-8ea08acd2ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwaW50ZXJpb3IlMjBQb3J0dWdhbHxlbnwxfHx8fDE3NzAxNDk0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Coleção exclusiva de 500 azulejos personalizados com o brasão do hotel e monumentos de Sintra",
    testimonial: "A qualidade das peças superou as nossas expectativas. Os nossos hóspedes adoram!",
    results: ["85% dos hóspedes compram", "500+ peças/mês", "4.9/5 avaliação"],
  },
  {
    client: "Museu Nacional do Azulejo",
    location: "Lisboa",
    href: "/casos-de-sucesso/museu-nacional-azulejo",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Reprodução de padrões históricos em formato de íman e porta-copos para a loja do museu",
    testimonial: "Parceria exemplar. Respeitaram a autenticidade histórica dos padrões.",
    results: ["92% satisfação", "800+ peças/mês", "55% aumento receita"],
  },
  {
    client: "Algarve Gift Shops Network",
    location: "Algarve",
    href: "/casos-de-sucesso/algarve-gift-shops",
    image: "https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2VyYW1pYyUyMHdvcmtzaG9wJTIwY3JhZnRzbWFuc2hpcHxlbnwxfHx8fDE3NzAxNDk0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fornecimento contínuo de lembranças personalizadas para rede de 12 lojas no Algarve",
    testimonial: "Excelente relação qualidade-preço e entregas sempre pontuais.",
    results: ["100% entregas pontuais", "3.000+ peças/mês", "3 anos parceria"],
  },
]

export default async function CaseStudiesPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/case-studies-hero-image.jpg)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Histórias de Sucesso
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Casos de Sucesso
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Descubra como ajudamos hotéis, museus e lojas em todo Portugal a criar
              lembranças cerâmicas personalizadas que encantam os seus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Parcerias de Confiança
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Clientes que Confiam em Nós
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hotéis, museus e lojas de prestígio em todo Portugal escolhem as nossas
              lembranças cerâmicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseStudy, idx) => (
              <LocalizedClientLink key={idx} href={caseStudy.href}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {/* Image */}
                  <div className="relative h-56 bg-gray-200">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.client}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Client Info */}
                    <div>
                      <h3 className="text-gray-900 mb-1 text-xl font-medium">
                        {caseStudy.client}
                      </h3>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {caseStudy.location}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                      {caseStudy.description}
                    </p>

                    {/* Results */}
                    <div className="mb-4 space-y-1">
                      {caseStudy.results.map((result, resultIdx) => (
                        <div key={resultIdx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full"></div>
                          <span className="text-gray-700 font-medium">{result}</span>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-[#0047AB]/5 rounded-lg p-4 relative">
                      <Quote className="w-6 h-6 text-[#0047AB]/20 absolute top-2 left-2" />
                      <p className="text-sm text-gray-700 italic pl-6">
                        "{caseStudy.testimonial}"
                      </p>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-[#0047AB] font-semibold hover:text-[#003685] transition-colors">
                        Ver Caso Completo →
                      </span>
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Resultados que Falam por Si
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-[#0047AB] mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>50+</div>
              <div className="text-gray-600">Clientes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-[#0047AB] mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>10k+</div>
              <div className="text-gray-600">Peças Produzidas/Mês</div>
            </div>
            <div className="text-center">
              <div className="text-[#0047AB] mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>98%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-[#0047AB] mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>15+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0047AB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Pronto para o Seu Caso de Sucesso?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para discutir como podemos criar uma
            coleção exclusiva para o seu negócio.
          </p>
          <LocalizedClientLink href="/contacto">
            <button className="px-8 py-4 bg-white text-[#0047AB] rounded-md hover:bg-blue-50 transition-colors shadow-lg" style={{ fontWeight: '600' }}>
              Falar com a Nossa Equipa
            </button>
          </LocalizedClientLink>
        </div>
      </section>

      <Footer />
    </div>
  )
}
