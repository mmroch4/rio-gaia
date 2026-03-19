import { listRegions } from "@/lib/data/regions"
import { ContactForm } from "@/modules/contact/components/contact-form"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Contacto - Rio Gaia",
  description: "Entre em contacto com a Rio Gaia para discutir as suas necessidades de lembranças cerâmicas personalizadas",
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

export default async function ContactPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/contact-hero-image.jpg)' }}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
              Entre em Contacto
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Vamos Trabalhar Juntos
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Entre em contacto connosco para discutir como podemos ajudar o seu negócio
              com lembranças cerâmicas personalizadas de qualidade superior.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-6" style={{ fontSize: '2rem', fontWeight: '700' }}>
              Informações de Contacto
            </h2>
            <p className="text-gray-600 text-lg">
              A nossa equipa está disponível para responder às suas questões e fornecer
              orçamentos personalizados para as suas necessidades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Phone */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#0047AB]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Telefone</h3>
                  <p className="text-gray-600">+351 XXX XXX XXX</p>
                  <p className="text-sm text-gray-500">Dias úteis, 9h-18h</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#0047AB]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">info@riogaia.pt</p>
                  <p className="text-sm text-gray-500">Resposta em até 24h</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#0047AB]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Morada</h3>
                  <p className="text-gray-600">Rua Example, 123</p>
                  <p className="text-gray-600">4400-000 Vila Nova de Gaia</p>
                  <p className="text-gray-600">Portugal</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0047AB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#0047AB]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Horário</h3>
                  <p className="text-gray-600">Segunda a Sexta: 9h - 18h</p>
                  <p className="text-gray-600">Sábado e Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Formulário de Contacto
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Envie-nos uma Mensagem
            </h2>
            <p className="text-xl text-gray-600">
              Preencha o formulário abaixo e entraremos em contacto consigo o mais breve possível.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
              Perguntas Frequentes
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
              Dúvidas Comuns
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Respostas rápidas às perguntas mais frequentes dos nossos clientes
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                Qual é a quantidade mínima de encomenda?
              </h3>
              <p className="text-gray-600">
                A quantidade mínima varia consoante o produto, mas geralmente trabalhamos com
                encomendas a partir de 100 unidades para garantir a viabilidade da personalização.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                Quanto tempo demora a produção?
              </h3>
              <p className="text-gray-600">
                O prazo padrão de produção é de 10-15 dias úteis após aprovação do design.
                Para encomendas urgentes, podemos discutir prazos mais curtos mediante disponibilidade.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                Fazem entregas para todo o país?
              </h3>
              <p className="text-gray-600">
                Sim, fazemos entregas para todo o território nacional. Os custos de envio
                são calculados com base na quantidade e destino da encomenda.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                Posso solicitar amostras antes de fazer uma encomenda grande?
              </h3>
              <p className="text-gray-600">
                Sim, oferecemos a possibilidade de produzir amostras para aprovação antes
                de proceder com encomendas de maior volume. Contacte-nos para mais detalhes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
