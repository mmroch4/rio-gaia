"use client";

import { AnvilIcon, Image as ImageIcon, Palette, Upload } from "lucide-react";
import { useState } from "react";

const customizationOptions = [
  {
    icon: Upload,
    title: "Imagens Personalizadas",
    description: "Formatos aceites: PNG, JPG, SVG. Resolução mínima: 300 DPI",
  },
  {
    icon: AnvilIcon,
    title: "Material e Acabamento à Escolha",
    description: "Lisboa, Porto, Sintra, Algarve ou qualquer local turístico",
  },
  {
    icon: Palette,
    title: "Escolha as Cores",
    description: "Azul cobalto tradicional ou cores personalizadas da sua marca",
  },
  {
    icon: ImageIcon,
    title: "Designs Exclusivos",
    description: "A nossa equipa pode criar designs únicos para o seu hotel ou museu",
  },
  {
    icon: ImageIcon,
    title: "Designs Exclusivos",
    description: "A nossa equipa pode criar designs únicos para o seu hotel ou museu",
  },
];




type CityPattern = {
  name: string;
  imageUrl: string;
};

const cityPatterns: CityPattern[] = [
  { name: "Lisboa", imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
  { name: "Porto", imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
  { name: "Sintra", imageUrl: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80" },
  { name: "Algarve", imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80" },
  { name: "Cascais", imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80" },
];



export function CustomizationSection() {
  const [selectedCity, setSelectedCity] = useState<CityPattern>(cityPatterns[0]);

  return (

    <section id="personalizacao" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#0047AB]/10 text-[#0047AB] rounded-full text-sm mb-4" style={{ fontWeight: '600' }}>
            Personalização Total
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' }}>
            Crie Lembranças Únicas para os Seus Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema de personalização industrial que permite criar peças exclusivas mantendo a qualidade artesanal portuguesa
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Customization Options */}
          <div className="space-y-6">
            {customizationOptions.map((option, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg hover:bg-[#0047AB]/5 transition-colors">
                <div className="w-12 h-12 bg-[#0047AB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {option.title}
                  </h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Visual Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-8">
              {/* Mock Tile Preview */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
                <div className="aspect-square bg-[#0047AB] rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Decorative image */}
                  <img
                    src={selectedCity.imageUrl}
                    alt={selectedCity.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Example Cities */}
              <div>
                <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600' }}>Exemplos de Modelos:</p>
                <div className="flex flex-wrap gap-2">
                  {cityPatterns.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 border rounded-full text-sm transition-colors ${selectedCity.name === city.name
                        ? 'bg-[#0047AB] text-white border-[#0047AB]'
                        : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-[#0047AB] hover:text-white'
                        }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-[#0047AB] text-white px-6 py-3 rounded-lg shadow-xl">
              <div className="text-sm">Prazo de Produção</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>10-15 dias</div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-[#0047AB] rounded-lg p-8 md:p-12 text-white">
          <h3 className="text-center mb-8" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
            Como Funciona o Processo de Personalização
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Contacto", desc: "Envie-nos as suas ideias e requisitos" },
              { step: "02", title: "Orçamento", desc: "Receba proposta em até 1 dia útil" },
              { step: "03", title: "Aprovação", desc: "Confirme o design e produção" },
              { step: "04", title: "Entrega", desc: "Receba em 10-15 dias úteis" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{item.step}</span>
                </div>
                <h4 className="mb-2" style={{ fontSize: '1.125rem', fontWeight: '600' }}>{item.title}</h4>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
