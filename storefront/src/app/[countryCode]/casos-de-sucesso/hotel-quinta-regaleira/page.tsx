import { listRegions } from "@/lib/data/regions"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Award, Check, MapPin, Package, Quote, TrendingUp, Users } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Hotel Quinta da Regaleira - Caso de Sucesso - Rio Gaia",
  description: "Descubra como a Rio Gaia ajudou o Hotel Quinta da Regaleira a criar uma coleção exclusiva de azulejos personalizados que encantam os hóspedes.",
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

export default async function CaseStudy1Page() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1712089295178-8ea08acd2ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwaW50ZXJpb3IlMjBQb3J0dWdhbHxlbnwxfHx8fDE3NzAxNDk0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Caso de Sucesso
            </div>

            <h1 className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Hotel Quinta da Regaleira
            </h1>

            <div className="flex items-center gap-2 text-xl text-blue-100 mb-6">
              <MapPin className="w-5 h-5" />
              Sintra, Portugal
            </div>

            <p className="text-xl text-blue-100 max-w-2xl">
              Coleção exclusiva de azulejos personalizados que elevou a experiência
              dos hóspedes e reforçou a identidade única do hotel.
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
                Uma Lembrança à Altura da História
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  O Hotel Quinta da Regaleira, localizado no coração histórico de Sintra,
                  procurava uma forma de oferecer aos seus hóspedes uma lembrança exclusiva
                  que refletisse a riqueza cultural e arquitetónica da região.
                </p>
                <p>
                  O desafio era criar peças cerâmicas de alta qualidade que incorporassem
                  o brasão do hotel e elementos icónicos de Sintra, mantendo a autenticidade
                  dos padrões tradicionais portugueses.
                </p>
                <p>
                  A solução tinha de ser escalável para produção em grande volume, sem
                  comprometer a qualidade artesanal que os hóspedes do hotel esperavam.
                </p>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-[#0047AB]/10 to-[#0047AB]/5 rounded-lg p-8 border border-[#0047AB]/20">
              <Quote className="w-12 h-12 text-[#0047AB]/30 mb-4" />
              <p className="text-gray-700 text-xl italic mb-6">
                "A qualidade das peças superou as nossas expectativas. Os nossos hóspedes
                adoram e muitos levam várias unidades como presentes. Foi uma parceria
                exemplar do início ao fim."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0047AB] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Maria Silva</div>
                  <div className="text-gray-600 text-sm">Diretora de Marketing</div>
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
              Desenvolvemos uma coleção completa de produtos cerâmicos personalizados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Azulejos Decorativos
              </h3>
              <p className="text-gray-600 mb-4">
                300 azulejos de 15x15 cm com o brasão do hotel e padrões de Sintra
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Design exclusivo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Embalagem premium
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Certificado de autenticidade
                </li>
              </ul>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Ímanes Cerâmicos
              </h3>
              <p className="text-gray-600 mb-4">
                200 ímanes de 7x7 cm com monumentos de Sintra
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  4 designs diferentes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Embalagem individual
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Acabamento brilhante
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-14 h-14 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-[#0047AB]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                Serviços Incluídos
              </h3>
              <p className="text-gray-600 mb-4">
                Suporte completo durante todo o projeto
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Desenvolvimento de design
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Amostras para aprovação
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0047AB]" />
                  Entrega e instalação
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
              Impacto Mensurável
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os números falam por si
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>85%</div>
              <div className="text-gray-600">Dos hóspedes compram lembranças</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>500+</div>
              <div className="text-gray-600">Peças vendidas/mês</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>4.9/5</div>
              <div className="text-gray-600">Avaliação dos hóspedes</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0047AB]" />
              </div>
              <div className="text-gray-900 mb-2" style={{ fontSize: '2.5rem', fontWeight: '700' }}>40%</div>
              <div className="text-gray-600">Aumento nas vendas de souvenirs</div>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h3 className="text-gray-900 mb-4 text-2xl font-semibold">Benefícios Alcançados</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Reforço da Identidade da Marca</div>
                  <p className="text-gray-600">As peças personalizadas tornaram-se um símbolo reconhecível do hotel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Experiência Premium</div>
                  <p className="text-gray-600">Hóspedes valorizam a qualidade e exclusividade das lembranças</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Marketing Orgânico</div>
                  <p className="text-gray-600">Peças partilhadas nas redes sociais geram visibilidade gratuita</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#0047AB] flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold mb-1">Receita Adicional</div>
                  <p className="text-gray-600">Nova fonte de rendimento com margens atrativas</p>
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
            Quer Resultados Semelhantes?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco para discutir como podemos criar uma
            coleção exclusiva para o seu negócio.
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
