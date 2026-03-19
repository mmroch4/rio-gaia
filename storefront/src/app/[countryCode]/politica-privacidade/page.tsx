import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Política de Privacidade | Rio Gaia",
  description: "Política de Privacidade da Rio Gaia - Como recolhemos, utilizamos e protegemos os seus dados pessoais.",
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

export default async function PrivacyPolicyPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] to-[#003685]">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-[#003685]/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-white mb-4" style={{ fontSize: '3rem', lineHeight: '1.1', fontWeight: '700' }}>
              Política de Privacidade
            </h1>
            <p className="text-xl text-blue-100">
              Estamos comprometidos em proteger a sua privacidade e garantir a segurança dos seus dados pessoais
              em conformidade com o RGPD e a legislação portuguesa.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A Rio Gaia Unipessoal Lda, NIF 519 165 276, com sede em Rua Fábrica da Lã 179 3° DTO FRENTE, Vila Nova de Gaia, 4400-706 Porto, valoriza a privacidade dos seus clientes e cumpre o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação portuguesa aplicável.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Esta Política explica como recolhemos, utilizamos, armazenamos e protegemos os seus dados pessoais ao utilizar o nosso website e serviços.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Dados Pessoais Recolhidos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Podemos recolher os seguintes dados pessoais:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone</li>
              <li>Morada de faturação e entrega</li>
              <li>Dados de faturação</li>
              <li>Histórico de compras e interações</li>
              <li>Dados de navegação (cookies, endereço IP, páginas visitadas, tempo de permanência)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Estes dados são recolhidos quando cria conta, realiza compras, nos contacta ou utiliza o website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Finalidades e Base Legal do Tratamento</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os seus dados são tratados para as seguintes finalidades:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3.1. Execução de Contrato</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Processamento de encomendas</li>
              <li>Entregas e logística</li>
              <li>Faturação</li>
              <li>Apoio ao cliente</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Base legal: Art.º 6.º, n.º 1, alínea b) do RGPD.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3.2. Cumprimento de Obrigações Legais</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Obrigações fiscais e contabilísticas</li>
              <li>Resposta a autoridades públicas</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Base legal: Art.º 6.º, n.º 1, alínea c) do RGPD.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3.3. Interesses Legítimos</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Prevenção de fraude</li>
              <li>Segurança do website</li>
              <li>Melhoria dos serviços</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Base legal: Art.º 6.º, n.º 1, alínea f) do RGPD.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3.4. Marketing (com consentimento)</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Envio de newsletters</li>
              <li>Campanhas promocionais</li>
              <li>Recomendações personalizadas</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Base legal: Art.º 6.º, n.º 1, alínea a) do RGPD.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Conservação dos Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os dados pessoais são conservados apenas pelo período necessário para cumprir as finalidades a que se destinam, respeitando prazos legais aplicáveis.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Exemplos:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Dados de faturação: prazo legal obrigatório</li>
              <li>Dados de conta: enquanto a conta estiver ativa</li>
              <li>Dados de marketing: até retirada do consentimento</li>
              <li>Cookies: conforme definido na política de cookies do website</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Partilha de Dados Pessoais</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Os seus dados podem ser partilhados com:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Prestadores de serviços (pagamentos, logística, TI, alojamento)</li>
              <li>Entidades públicas quando exigido por lei</li>
              <li>Parceiros contratualmente vinculados, quando necessário para a prestação do serviço</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Rio Gaia não vende dados pessoais a terceiros.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Acesso não autorizado</li>
              <li>Perda</li>
              <li>Alteração</li>
              <li>Divulgação indevida</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Inclui encriptação, controlo de acessos, servidores seguros e monitorização contínua.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Direitos do Titular dos Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O utilizador pode exercer, a qualquer momento, os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Acesso aos seus dados</li>
              <li>Retificação de dados incorretos</li>
              <li>Apagamento (“direito a ser esquecido”)</li>
              <li>Oposição ao tratamento</li>
              <li>Portabilidade dos dados</li>
              <li>Limitação do tratamento</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para exercer qualquer direito, contacte: <a href="mailto:geral@riogaia.com" className="text-[#0047AB] hover:underline">geral@riogaia.com</a>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Também pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos cookies essenciais para o funcionamento do website e cookies analíticos para melhorar a experiência do utilizador.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              O utilizador pode gerir ou desativar cookies através das definições do navegador, embora isso possa afetar algumas funcionalidades do website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Contactos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para questões relacionadas com privacidade e proteção de dados:
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
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
