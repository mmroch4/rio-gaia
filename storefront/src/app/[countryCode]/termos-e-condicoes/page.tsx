import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Termos e Condições | Rio Gaia",
  description: "Termos e Condições de Utilização da Rio Gaia - Regras e condições para utilização do nosso website e serviços.",
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

export default async function TermsPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] to-[#003685]">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Termos e Condições
            </h1>
            <p className="text-xl text-blue-100">
              Ao utilizar o nosso website e serviços, concorda em ficar vinculado a estes Termos e Condições.
              Por favor, leia-os atentamente.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Última atualização:</strong> 9 de fevereiro de 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bem-vindo(a) ao website da Rio Gaia Unipessoal Lda, NIF 519 165 276, com sede em Rua Fábrica da Lã 179 3° DTO FRENTE, Vila Nova de Gaia, 4400-706 Porto. Estes Termos de Serviço (“Termos”) regulam o uso do nosso website e a compra de produtos, incluindo azulejos decorativos e outros artigos disponibilizados na nossa loja online.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ao utilizar o website, concorda com estes Termos. Caso não concorde, não deverá utilizar os nossos serviços.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Registo e Conta de Utilizador</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para efetuar compras e aceder a funcionalidades específicas, poderá ser necessário criar uma conta. O utilizador compromete-se a fornecer dados verdadeiros, completos e atualizados.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2.1. Elegibilidade</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O utilizador deve ter pelo menos 18 anos para criar conta e realizar compras.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2.2. Segurança da Conta</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O utilizador é responsável por manter a confidencialidade da sua palavra‑passe e por todas as atividades realizadas na sua conta.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Produtos e Preços</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os produtos apresentados são descritos com o máximo rigor possível. Os preços incluem IVA à taxa legal em vigor. Os custos de envio são apresentados no checkout antes da finalização da compra.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3.1. Disponibilidade</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Todos os produtos estão sujeitos a disponibilidade de stock. Em caso de rutura, o cliente será informado e poderá optar por substituição ou reembolso.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Processo de Compra</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O processo de compra inclui seleção de produtos, revisão do carrinho, checkout e confirmação por e-mail.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4.1. Métodos de Pagamento</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os pagamentos são processados através dos métodos disponibilizados no checkout, por entidades certificadas. A Rio Gaia não armazena dados completos de pagamento.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Entrega</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As entregas são efetuadas para Portugal continental e ilhas. Os prazos estimados são apresentados no checkout. A Rio Gaia não se responsabiliza por atrasos causados por fatores externos, como transportadoras ou condições climatéricas.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Devoluções e Reembolsos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O consumidor dispõe de 14 dias para exercer o direito de livre resolução, exceto em produtos personalizados ou feitos sob encomenda.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os produtos devolvidos devem estar em perfeitas condições, sem sinais de uso e na embalagem original.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Garantias</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os produtos beneficiam da garantia legal prevista no Decreto‑Lei n.º 84/2021. Em caso de falta de conformidade, o consumidor tem direito à reparação, substituição, redução do preço ou resolução do contrato.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Todo o conteúdo do website, incluindo textos, imagens, logótipos e design, é propriedade da Rio Gaia ou dos seus fornecedores e encontra-se protegido por legislação aplicável.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Rio Gaia não se responsabiliza por danos indiretos ou consequenciais resultantes do uso do website ou da impossibilidade de o utilizar.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">10. Lei Aplicável e Resolução de Litígios</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os presentes Termos regem-se pela lei portuguesa. Em caso de litígio, o consumidor pode recorrer às entidades de Resolução Alternativa de Litígios disponíveis em <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:underline">www.consumidor.gov.pt</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">11. Contactos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Email: <a href="mailto:geral@riogaia.com" className="text-[#0047AB] hover:underline">geral@riogaia.com</a><br />
              Telefone: <a href="tel:+351966764605" className="text-[#0047AB] hover:underline">+351 966 764 605</a><br />
              Morada: Rua Fábrica da Lã 179 3° DTO FRENTE, Vila Nova de Gaia, 4400-706 Porto
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
