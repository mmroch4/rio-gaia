"use client"

import Login from "@/modules/account/components/login"
import { Footer } from "@/modules/home/components/Footer"
import { Header } from "@/modules/home/components/Header"

interface LoginTemplateProps {
  countryCode: string
  sessionExpired?: boolean
}

const LoginTemplate = ({ countryCode, sessionExpired }: LoginTemplateProps) => {
  return (
    <div>
      <Header />

      {/* Two-Column Layout Section */}
      <section className="min-h-screen bg-gray-50">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Form */}
          <div className="flex items-center justify-center bg-neutral-100 px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-md">
              {sessionExpired && (
                <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  A sua sessão expirou. Por favor, inicie sessão novamente.
                </div>
              )}
              <div className="flex flex-col gap-6 my-auto">
                <Login countryCode={countryCode} />
              </div>
            </div>
          </div>

          {/* Right Column - Decorative Visual */}
          <div className="hidden lg:flex relative text-white overflow-hidden bg-gradient-to-br from-[#0047AB] via-[#0047AB] to-[#003685]">
            <div className="flex items-center justify-center w-full px-8 lg:px-12">
              <div className="max-w-lg">
                <div className="inline-block px-4 py-2 mb-6 bg-white/10 rounded-full text-sm backdrop-blur-sm">
                  Área de Cliente
                </div>

                <h1 className="text-white mb-6" style={{ fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' }}>
                  Bem-vindo de volta
                </h1>

                <p className="text-xl text-blue-100 mb-8">
                  Aceda à sua conta para gerir encomendas, orçamentos e informações da empresa
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Gestão de Encomendas</div>
                      <div className="text-blue-100 text-sm">Acompanhe o estado das suas encomendas em tempo real</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Orçamentos Personalizados</div>
                      <div className="text-blue-100 text-sm">Solicite e consulte orçamentos para o seu negócio</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Informações da Empresa</div>
                      <div className="text-blue-100 text-sm">Gerencie os dados e preferências da sua empresa</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LoginTemplate
