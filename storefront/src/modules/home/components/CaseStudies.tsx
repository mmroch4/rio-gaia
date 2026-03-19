import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { MapPin, Quote } from "lucide-react";

const cases = [
  {
    client: "Hotel Quinta da Regaleira",
    location: "Sintra",
    href: "/casos-de-sucesso/hotel-quinta-regaleira",
    image: "https://images.unsplash.com/photo-1712089295178-8ea08acd2ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwaW50ZXJpb3IlMjBQb3J0dWdhbHxlbnwxfHx8fDE3NzAxNDk0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Coleção exclusiva de 500 azulejos personalizados com o brasão do hotel e monumentos de Sintra",
    testimonial: "A qualidade das peças superou as nossas expectativas. Os nossos hóspedes adoram!",
  },
  {
    client: "Museu Nacional do Azulejo",
    location: "Lisboa",
    href: "/casos-de-sucesso/museu-nacional-azulejo",
    image: "https://images.unsplash.com/photo-1762786924368-f18185f5382c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0dWd1ZXNlJTIwY2VyYW1pYyUyMHRpbGVzJTIwYmx1ZSUyMHdoaXRlfGVufDF8fHx8MTc3MDE0OTQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Reprodução de padrões históricos em formato de íman e porta-copos para a loja do museu",
    testimonial: "Parceria exemplar. Respeitaram a autenticidade histórica dos padrões.",
  },
  {
    client: "Algarve Gift Shops Network",
    location: "Algarve",
    href: "/casos-de-sucesso/algarve-gift-shops",
    image: "https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2VyYW1pYyUyMHdvcmtzaG9wJTIwY3JhZnRzbWFuc2hpcHxlbnwxfHx8fDE3NzAxNDk0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Fornecimento contínuo de lembranças personalizadas para rede de 12 lojas no Algarve",
    testimonial: "Excelente relação qualidade-preço e entregas sempre pontuais.",
  },
];

export function CaseStudies() {

  return (
    <section id="casos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
            Casos de Sucesso
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Clientes que Confiam em Nós
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hotéis, museus e lojas de prestigio em todo Portugal escolhem as nossas lembranças cerâmicas
          </p>
        </div>

        {/* Highlighted Case Study */}
        <div className="hidden md:block">
          <LocalizedClientLink href={cases[0].href}>
            <div className="mb-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-white flex justify-between rounded-lg overflow-hidden h-80">
                {/* Image */}
                <div className="relative w-1/2 bg-gray-200">
                  <img
                    src={cases[0].image}
                    alt={cases[0].client}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 w-1/2 flex flex-col justify-between">
                  {/* Client Name */}
                  <div>
                    <h3 className="text-gray-900 text-2xl font-medium mb-1">
                      {cases[0].client}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      {cases[0].location}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 text-lg">
                      {cases[0].description}
                    </p>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-[#0047AB]/5 rounded-lg p-4 relative">
                    <Quote className="w-6 h-6 text-[#0047AB]/20 absolute top-2 left-2" />
                    <p className="text-gray-700 italic pl-6">
                      "{cases[0].testimonial}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, idx) => (
            <CaseStudyCard key={idx} caseStudy={caseStudy} />
          ))}
        </div>

        {/* View All Case Studies Button */}
        <div className="text-center mt-12">
          <LocalizedClientLink href="/casos-de-sucesso">
            <button className="px-8 py-4 bg-[#0047AB] text-white rounded-md hover:bg-[#003685] transition-colors shadow-md" style={{ fontWeight: '600' }}>
              Ver Todos os Casos de Sucesso →
            </button>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: any }) {
  return (
    <LocalizedClientLink href={caseStudy.href}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

          {/* Testimonial */}
          <div className="bg-[#0047AB]/5 rounded-lg p-4 relative">
            <Quote className="w-6 h-6 text-[#0047AB]/20 absolute top-2 left-2" />
            <p className="text-sm text-gray-700 italic pl-6">
              "{caseStudy.testimonial}"
            </p>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
